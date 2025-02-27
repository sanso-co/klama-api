import mongoose from "mongoose";

import { ICredit } from "../interfaces/credit";

const creditSchema = new mongoose.Schema(
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
        job: {
            type: String,
            enum: ["Director", "Screenwriter", "Producer", "Original Author"],
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

export default mongoose.model<ICredit>("Credit", creditSchema);
