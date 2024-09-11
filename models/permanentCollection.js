import mongoose from "mongoose";

const showSchema = new mongoose.Schema(
    {
        id: { type: String, required: true },
        name: { type: String, required: true },
        original_name: String,
        first_air_date: Date,
        poster_path: String,
        genre_ids: [String],
    },
    { _id: false }
);

const permanentCollection = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
        },
        shows: [showSchema],
    },
    { timestamps: true }
);

export default mongoose.model("PermanentCollection", permanentCollection);
