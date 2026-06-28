import { modelClient } from '../model_client.js';

const run = async () => {
  try {
    console.log("Testing model client...");
    await modelClient.init();
    console.log("Initialised, running prediction...");
    const res = await modelClient.predict("This agreement is between Party A and Party B for NDA purposes.");
    console.log("Prediction response:", res);
    process.exit(0);
  } catch (err) {
    console.error("Prediction error:", err);
    process.exit(1);
  }
};

run();
