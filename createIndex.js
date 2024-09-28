import mongoose from "mongoose";
import Show from "./models/show.js";
import dotenv from "dotenv";

dotenv.config();

const dbOptions = {};

async function createIndexes() {
    try {
        await mongoose.connect(process.env.MONGODB_ADDRESS, dbOptions);
        await Show.createIndexes();
        console.log("Indexes created successfully");
    } catch (error) {
        console.error("Error creating indexes:", error);
    } finally {
        await mongoose.disconnect();
    }
}

createIndexes().catch(console.error);
