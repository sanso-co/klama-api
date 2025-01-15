import mongoose from "mongoose";

import { KeywordType } from "../interfaces/keyword";

const keywordSchema = new mongoose.Schema(
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

export default mongoose.model<KeywordType>("Keyword", keywordSchema);
