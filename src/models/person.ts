import mongoose from "mongoose";

import { IPerson } from "../interfaces/person";

const personSchema = new mongoose.Schema(
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
        profile_path: {
            type: String,
        },
        known_for_department: {
            type: String,
        },
        shows: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Show",
            },
        ],
    },
    { timestamps: true }
);

export default mongoose.model<IPerson>("Person", personSchema);
