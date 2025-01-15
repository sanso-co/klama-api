import mongoose from "mongoose";

import { CastType } from "../interfaces/cast";

const castSchema = new mongoose.Schema(
    {
        id: {
            type: Number,
            required: true,
            unique: true,
        },
        casts: [
            {
                person: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Person",
                    required: true,
                },
                role: {
                    type: String,
                },
                original_role: {
                    type: String,
                    default: "",
                },
                order: {
                    type: Number,
                },
            },
        ],
    },
    { timestamps: true }
);

export default mongoose.model<CastType>("Cast", castSchema);
