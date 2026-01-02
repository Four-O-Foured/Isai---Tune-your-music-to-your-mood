import mongoose from "mongoose";

export function connectToDB() {
    mongoose.connect(process.env.MONGO_URL)
        .then(() => console.log("Connected to MongoDB"))
        .catch(err => console.error("MongoDB connection error:", err));
}