import mongoose from "mongoose";
import config from "./config";

const connectDB = async () => {
    try {
        await mongoose.connect(`${config.MONGODB_URI}/app`, {});
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    }
};

export default connectDB;