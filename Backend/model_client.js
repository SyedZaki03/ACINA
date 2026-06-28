// Import standard Node.js module to spawn sub-processes
import { spawn } from 'child_process';
// Import path module to handle and format system paths
import path from 'path';
// Import fs module to check for existence of virtual environment paths
import fs from 'fs';

// Define the ModelClient class to coordinate communication with the Python-based BERT worker process
class ModelClient {
  constructor() {
    // Reference to the active spawned child process
    this.worker = null;
    // Request queue to store callbacks (resolves/rejects) mapping to sequential Python model requests
    this.queue = [];
    // Boolean status flag indicating if the Python worker is ready to handle predictions
    this.isReady = false;
    // Cached initialization promise to prevent multiple concurrent spawn attempts
    this.initPromise = null;
  }

  // Method to initialize the worker connection, returns a Promise
  init() {
    // If initialization is already underway or completed, return the existing promise
    if (this.initPromise) return this.initPromise;

    // Create a new promise executing the candidate python lookup and worker startup
    this.initPromise = new Promise(async (resolve, reject) => {
      // Resolve the current working directory as the backend root
      const backendDir = path.resolve('.');
      
      // List of candidate python executable paths to attempt running
      const candidates = [];
      
      // Define path patterns for local python virtual environments (Windows and Unix-like)
      const winVenvPath = path.join(backendDir, 'venv', 'Scripts', 'python.exe');
      const unixVenvPath = path.join(backendDir, 'venv', 'bin', 'python');

      // Add existing virtual environment python executables to candidates
      if (fs.existsSync(winVenvPath)) {
        candidates.push(winVenvPath);
      }
      if (fs.existsSync(unixVenvPath)) {
        candidates.push(unixVenvPath);
      }
      // Fall back to system python path variables
      candidates.push('python');
      candidates.push('python3');

      // Keep track of errors from failed spawn attempts
      let lastError = null;

      // Iterate through candidates list and try to spawn a working sub-process
      for (const pythonPath of candidates) {
        try {
          // Attempt spawning worker with the selected candidate path
          const success = await this.spawnWorker(pythonPath, backendDir);
          if (success) {
            // Resolve promise and break the loop on success
            resolve();
            return;
          }
        } catch (err) {
          // Log a warning and save error details if python candidate fails
          console.warn(`[Model Client warning]: Failed to start worker using "${pythonPath}": ${err.message}`);
          lastError = err;
        }
      }

      // Reject the promise if all potential python paths failed
      reject(lastError || new Error('All python candidates failed to launch the model worker'));
    });

    return this.initPromise;
  }

  // Spawn the Python process and set up event listeners for standard I/O streams
  spawnWorker(pythonPath, backendDir) {
    return new Promise((resolve, reject) => {
      // Log initialization attempt
      console.log(`🤖 Attempting to start BERT model worker using: ${pythonPath}`);
      // Construct path to Python worker script
      const workerScript = path.join(backendDir, 'model_worker.py');
      
      // Spawn python child process with standard streams piped
      const worker = spawn(pythonPath, [workerScript], {
        cwd: backendDir,
        stdio: ['pipe', 'pipe', 'pipe']
      });

      // Buffer to store stdout chunk strings
      let stdoutBuffer = '';
      // State flag to track if initialization promise is settled
      let isSettled = false;

      // Handle standard output data chunks from Python worker
      worker.stdout.on('data', (data) => {
        // Append chunk to the buffer
        stdoutBuffer += data.toString('utf8');
        // Find newline boundaries to parse separate JSON lines
        let boundary = stdoutBuffer.indexOf('\n');
        
        // Loop while a complete line exists in stdoutBuffer
        while (boundary !== -1) {
          // Slice the line out and trim whitespace
          const line = stdoutBuffer.substring(0, boundary).trim();
          // Update buffer to hold remaining unprocessed data
          stdoutBuffer = stdoutBuffer.substring(boundary + 1);
          
          // Handle the non-empty response line
          if (line) {
            this.handleResponse(line);
          }
          // Recalculate next newline boundary
          boundary = stdoutBuffer.indexOf('\n');
        }
      });

      // Handle logs and ready signal on stderr channel
      worker.stderr.on('data', (data) => {
        const message = data.toString('utf8');
        // Print worker debug logs
        console.log(`[Model Worker log]: ${message.trim()}`);
        // If the ready indicator string is sent and promise not resolved yet, complete setup
        if (message.includes('Model worker ready') && !isSettled) {
          isSettled = true;
          this.worker = worker;
          this.isReady = true;
          resolve(true);
        }
      });

      // Handle errors during process creation/runtime
      worker.on('error', (err) => {
        if (!isSettled) {
          isSettled = true;
          reject(err);
        }
      });

      // Handle process exit event
      worker.on('exit', (code) => {
        if (!isSettled) {
          isSettled = true;
          reject(new Error(`Process exited with code ${code}`));
        } else {
          console.log(`BERT model worker exited with code ${code}`);
          this.isReady = false;
          this.worker = null;
          this.initPromise = null;
        }
      });
    });
  }

  // Parse and match incoming response lines to the oldest queued request callback
  handleResponse(line) {
    try {
      // Parse the JSON string from stdout
      const response = JSON.parse(line);
      // Retrieve the oldest pending callback resolver from the FIFO queue
      const callback = this.queue.shift();
      if (callback) {
        // Resolve or reject the matching pending promise based on success field
        if (response.success) {
          callback.resolve(response);
        } else {
          callback.reject(new Error(response.error || 'Prediction failed'));
        }
      }
    } catch (e) {
      // Log errors on parsing failure and reject oldest callback
      console.error('Failed to parse response from worker:', line, e);
      const callback = this.queue.shift();
      if (callback) {
        callback.reject(e);
      }
    }
  }

  // Helper method to send a command object to Python stdin and register a callback promise
  async sendCommand(command) {
    // Ensure the worker is initialized and ready
    await this.init();
    return new Promise((resolve, reject) => {
      // Add the promise controls to the queue
      this.queue.push({ resolve, reject });
      // Write JSON payload with trailing newline to Python's stdin
      this.worker.stdin.write(JSON.stringify(command) + '\n');
    });
  }

  // Interface method to request text classification from the BERT model
  async predict(text) {
    return this.sendCommand({ action: 'predict', text });
  }

  // Interface method to request information about model loading and state
  async getInfo() {
    return this.sendCommand({ action: 'info' });
  }
}

// Export a singleton instance of the model client
export const modelClient = new ModelClient();
