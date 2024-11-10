import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dbOptions = {};

async function migrateShowModel() {
    try {
        await mongoose.connect(process.env.MONGODB_ADDRESS, dbOptions);

        // Get the database instance
        const db = mongoose.connection.db;

        // Update all shows to add keywords field if it doesn't exist
        const result = await db
            .collection("shows")
            .updateMany({ keywords: { $exists: false } }, { $set: { keywords: [] } });

        console.log(`Successfully updated shows with keywords field`);
        console.log(`Modified ${result.modifiedCount} documents`);
    } catch (error) {
        console.error("Error migrating show model:", error);
        if (error.code === 26) {
            console.error("Collection not found. Make sure the collection name is correct.");
        }
    } finally {
        await mongoose.disconnect();
    }
}

migrateShowModel().catch(console.error);
