import mongoose from "mongoose";

import { ProviderType } from "../interfaces/provider";

const providerSchema = new mongoose.Schema(
    {
        id: {
            type: Number,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        logo_path: {
            type: String,
        },
        display_priority: {
            type: Number,
            default: 999,
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

export default mongoose.model<ProviderType>("Provider", providerSchema);
