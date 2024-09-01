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

const periodicCollection = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
        },
        frequency: {
            type: String,
            required: true,
            enum: ["weekly", "quarterly"],
        },
        lists: [
            {
                releaseDate: {
                    type: Date,
                    required: true,
                },
                shows: [showSchema],
            },
        ],
    },
    { timestamps: true }
);

export default mongoose.model("PeriodicCollection", periodicCollection);
