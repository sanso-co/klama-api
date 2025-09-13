import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_ADDRESS = process.env.MONGODB_ADDRESS;

if (!MONGODB_ADDRESS) {
    console.error("MONGODB_ADDRESS is not set in environment variables.");
    process.exit(1);
}

const dbOptions = {};

async function removeKeywordsField() {
    try {
        await mongoose.connect(MONGODB_ADDRESS, dbOptions);

        // Get the database instance
        const db = mongoose.connection.db;

        if (!db) {
            throw new Error("Database connection failed. 'db' is undefined.");
        }

        // Remove the original_story field from all shows that have it
        const result = await db.collection("shows").updateMany(
            { keywords: { $exists: true } }, // keywords 필드가 있는 document 찾기
            { $unset: { keywords: "" } } // keywords 필드 제거
        );

        console.log(`Successfully removed keywords from ${result.modifiedCount} shows.`);
    } catch (error) {
        console.error("Error removing keywords field:", error);

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

removeKeywordsField().catch(console.error);
