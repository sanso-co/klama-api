import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_ADDRESS = process.env.MONGODB_ADDRESS;

if (!MONGODB_ADDRESS) {
    console.error("MONGODB_ADDRESS is not set in environment variables.");
    process.exit(1);
}

const dbOptions = {};

async function removeOriginalStoryField() {
    try {
        await mongoose.connect(MONGODB_ADDRESS, dbOptions);

        // Get the database instance
        const db = mongoose.connection.db;

        if (!db) {
            throw new Error("Database connection failed. 'db' is undefined.");
        }

        // Remove the original_story field from all shows that have it
        const result = await db.collection("shows").updateMany(
            { original_story: { $exists: true } }, // Find shows with original_story
            { $unset: { original_story: "" } } // Remove original_story field
        );

        console.log(`Successfully removed original_story from ${result.modifiedCount} shows.`);
    } catch (error) {
        console.error("Error removing original_story field:", error);

        if (typeof error === "object" && error !== null && "code" in error) {
            const errorCode = error.code;
            if (errorCode === 26) {
                console.error("Collection not found. Make sure the collection name is correct.");
            }
        }
    } finally {
        await mongoose.disconnect();
    }
}

removeOriginalStoryField().catch(console.error);
