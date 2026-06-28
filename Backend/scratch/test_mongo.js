import mongoose from 'mongoose';

const uri1 = "mongodb+srv://syedzaki2003:zakisumiusman@cluster0.u89fmgv.mongodb.net/acina?retryWrites=true&w=majority&appName=Cluster0";
const uri2 = "mongodb+srv://syedzaki2003:zakisumiusman%3E@cluster0.u89fmgv.mongodb.net/acina?retryWrites=true&w=majority&appName=Cluster0";

const test = async () => {
  console.log("Trying uri1 (without >)...");
  try {
    await mongoose.connect(uri1);
    console.log("SUCCESS for uri1!");
    process.exit(0);
  } catch (err) {
    console.error("FAILED for uri1:", err.message);
  }

  console.log("Trying uri2 (with >)...");
  try {
    await mongoose.connect(uri2);
    console.log("SUCCESS for uri2!");
    process.exit(0);
  } catch (err) {
    console.error("FAILED for uri2:", err.message);
  }
  
  process.exit(1);
};

test();
