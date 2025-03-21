import mongoose from "mongoose";

import { ITone } from "../interfaces/tone";

const toneSchema = new mongoose.Schema(
    {
        id: {
            type: Number,
            required: true,
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

export default mongoose.model<ITone>("Tone", toneSchema);
