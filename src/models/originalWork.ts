import mongoose from "mongoose";

import { IOriginalWork } from "../interfaces/originalWork";

const originalWorkSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        original_title: {
            type: String,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Credit",
            required: true,
        },
        type: {
            type: String,
            enum: ["Novel", "Webtoon", "Other"],
        },
        published_year: {
            type: Number,
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

export default mongoose.model<IOriginalWork>("OriginalWork", originalWorkSchema);
