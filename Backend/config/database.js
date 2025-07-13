import mongoose from "mongoose";

const connectdb = async () => {
    try {
        await mongoose.connect(process.env.mongo_url);
        console.log("✅ MongoDB connected successfully");
    } catch (e) {
        console.log("❌ MongoDB connection failed:", e.message);
        process.exit(1);
    }
}


export default connectdb;
