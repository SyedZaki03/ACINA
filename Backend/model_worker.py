"""
Background PyTorch BERT Model Worker
Listens on stdin for classification commands and outputs JSON to stdout.
Keeps the PyTorch model warm in memory to avoid reload latency.
"""
# Import native system operations and file-path helpers
import os
# Import sys module to communicate with stdin/stdout/stderr pipes
import sys
# Import regular expressions library for sanitizing input text
import re
# Import json for parsing and serializing worker messages
import json
# Import pickle to deserialize the label encoder mapping object
import pickle
# Import torch to load PyTorch variables, perform tensor computations
import torch
# Import HuggingFace transformers modules for BERT tokenization and sequence classification
from transformers import AutoTokenizer, BertForSequenceClassification

# Define directories/filenames for the model tokenizer and output labels mapping
MODEL_PATH = "bert_model"
LABEL_ENCODER_PATH = "label_encoder.pkl"
# Maximum sequence length supported by our model configuration
MAX_LENGTH = 512

# Initialize global references for the model components and CPU/CUDA processing target
tokenizer = None
model = None
label_encoder = None
device = None

# Loads the saved tokenizer, PyTorch weights, and label mappings into GPU or CPU memory
def initialize_model():
    global tokenizer, model, label_encoder, device
    try:
        # Determine if Nvidia CUDA GPU is available for inference, else fallback to CPU
        device = "cuda" if torch.cuda.is_available() else "cpu"
        
        # Load the HuggingFace pre-trained BERT tokenizer
        tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
        # Load the sequence classification model weights from the local BERT folder
        model = BertForSequenceClassification.from_pretrained(MODEL_PATH)
        # Shift the model variables to the target hardware device (CPU or GPU)
        model.to(device)
        # Put the model in evaluation mode to turn off dropout/batch normalization
        model.eval()
        
        # Open and load the serialized label encoder from pickle format
        with open(LABEL_ENCODER_PATH, 'rb') as f:
            label_encoder = pickle.load(f)
            
        # Return success status
        return True
    except Exception as e:
        # Write error traces to stderr so they don't corrupt the stdout JSON pipe
        sys.stderr.write(f"Error initializing model in worker: {str(e)}\n")
        sys.stderr.flush()
        return False

# Sanitizes text by removing excessive whitespaces and non-standard symbols
def clean_text(text):
    # Compress multiple spaces or newlines into a single whitespace
    text = re.sub(r'\s+', ' ', text)
    # Remove characters that are not letters, numbers, punctuation, or basic layout symbols
    text = re.sub(r'[^\w\s.,;:\-()@/]', '', text)
    # Remove leading and trailing whitespaces and return
    return text.strip()

# Takes a string, tokenizes it, feeds it to the BERT model, and returns predicted class and confidence
def predict(text):
    # Enforce initialization checklist
    if tokenizer is None or model is None or label_encoder is None:
        raise RuntimeError("Model components are not initialized")
        
    # Clean the input text
    cleaned = clean_text(text)
    # Block empty inputs
    if not cleaned:
        raise ValueError("Empty or invalid text provided for prediction")
        
    # Run the BERT tokenizer on the cleaned string, preparing inputs as PyTorch tensors
    inputs = tokenizer(
        cleaned,
        truncation=True,
        padding='max_length',
        max_length=MAX_LENGTH,
        return_tensors='pt'
    ).to(device) # Transfer tensors to CPU/GPU device
    
    # Disable gradient tracking for faster inference and lower memory consumption
    with torch.no_grad():
        # Retrieve logits (raw scores) from the model forward pass
        outputs = model(**inputs)
        # Apply Softmax to convert raw logits into probability distribution
        probs = torch.softmax(outputs.logits, dim=1)
        # Find index of the highest probability
        pred_idx = torch.argmax(probs, dim=1).item()
        # Retrieve the confidence value of the winning index
        confidence = probs[0][pred_idx].item()
        
    # Convert index back to original label string using the label encoder
    predicted_label = label_encoder.inverse_transform([pred_idx])[0]
    
    # Extract the top 3 highest probabilities and their corresponding indices
    top_probs, top_indices = torch.topk(
        probs[0],
        min(3, len(label_encoder.classes_))
    )
    
    # Structure the top predictions with labels and percentages
    top_predictions = []
    for prob, idx in zip(top_probs.tolist(), top_indices.tolist()):
        top_predictions.append({
            "class": label_encoder.inverse_transform([idx])[0],
            "confidence": round(prob * 100, 2)
        })
        
    # Construct and return success result dict
    return {
        "success": True,
        "predicted_class": predicted_label,
        "confidence": round(confidence * 100, 2),
        "top_predictions": top_predictions
    }

# Main execution loop of the worker script
def main():
    # Force system pipes to use UTF-8 coding to prevent decoding errors
    sys.stdout.reconfigure(encoding='utf-8') if hasattr(sys.stdout, 'reconfigure') else None
    sys.stdin.reconfigure(encoding='utf-8') if hasattr(sys.stdin, 'reconfigure') else None
    
    # Load BERT model and encoder mapping
    success = initialize_model()
    # Exit with code 1 if the model fails to load
    if not success:
        sys.exit(1)
        
    # Print notification to stderr signifying readiness
    sys.stderr.write("Model worker ready\n")
    sys.stderr.flush()
    
    # Listen continuously on standard input for commands
    for line in sys.stdin:
        try:
            # Clean standard input line whitespace
            line = line.strip()
            # Ignore empty lines
            if not line:
                continue
                
            # Decode the command payload from JSON format
            req = json.loads(line)
            # Retrieve command action
            action = req.get("action")
            
            # Direct requests based on specified action value
            if action == "predict":
                # Get target text for classification
                text = req.get("text", "")
                # Run prediction
                res = predict(text)
                # Print result as JSON string to stdout
                print(json.dumps(res))
            elif action == "info":
                # Return current model information and loaded classes list
                info = {
                    "success": True,
                    "status": "loaded",
                    "device": device,
                    "classes": list(label_encoder.classes_) if label_encoder else []
                }
                print(json.dumps(info))
            elif action == "ping":
                # Responds to check connection status
                print(json.dumps({"success": True, "pong": True}))
            else:
                # Return error for unsupported command strings
                print(json.dumps({"success": False, "error": f"Unknown action: {action}"}))
                
            # Force flush stdout stream to prevent buffering delays
            sys.stdout.flush()
        except Exception as e:
            # Print catch-all exception JSON messages
            print(json.dumps({"success": False, "error": str(e)}))
            sys.stdout.flush()

# Execute entrypoint
if __name__ == "__main__":
    main()
