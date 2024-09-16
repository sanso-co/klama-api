import mongoose from "mongoose";

const showSchema = new mongoose.Schema(
    {
        id: { type: Number, required: true },
        name: { type: String, required: true },
        original_name: String,
        first_air_date: Date,
        poster_path: String,
        genre_ids: [String],
    },
    { _id: false }
);

const recommendations = mongoose.Schema(
    {
        id: {
            type: Number,
            required: true,
        },
        details: {
            name: {
                type: String,
                required: true,
            },
            original_name: {
                type: String,
            },
            poster_path: {
                type: String,
            },
        },
        results: [showSchema],
    },
    { timestamps: true }
);

export default mongoose.model("Recommendations", recommendations);
