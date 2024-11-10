import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dbOptions = {};

async function removeShowsFromKeywords() {
    try {
        await mongoose.connect(process.env.MONGODB_ADDRESS, dbOptions);
        console.log("Connected to MongoDB");

        const db = mongoose.connection.db;
        const keywordsCollection = db.collection("keywords");

        // Remove 'shows' field from all keywords
        const result = await keywordsCollection.updateMany(
            { shows: { $exists: true } }, // only update documents that have 'shows' field
            { $unset: { shows: "" } }
        );

        console.log(`Successfully removed 'shows' field from keywords`);
        console.log(`Modified ${result.modifiedCount} documents`);
    } catch (error) {
        console.error("Error removing shows from keywords:", error);
        if (error.code === 26) {
            console.error("Collection not found. Make sure the collection name is correct.");
        }
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    }
}

removeShowsFromKeywords().catch(console.error);
