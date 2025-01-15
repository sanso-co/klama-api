import mongoose from "mongoose";

import { GenreType } from "../interfaces/genre";

const genreSchema = new mongoose.Schema(
    {
        id: {
            type: Number,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },
        original_name: {
            type: String,
        },
        rank: {
            type: Number,
            default: 999,
        },
    },
    { timestamps: true }
);

export default mongoose.model<GenreType>("Genre", genreSchema);
