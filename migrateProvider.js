import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dbOptions = {};

async function migrateShowModel() {
    try {
        await mongoose.connect(process.env.MONGODB_ADDRESS, dbOptions);

        // Get the database instance
        const db = mongoose.connection.db;

        // Update all shows to add season_number field
        const result = await db
            .collection("shows")
            .updateMany({ season_number: { $exists: false } }, { $set: { season_number: 1 } });

        console.log(`Successfully updated shows with season_number field`);
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
