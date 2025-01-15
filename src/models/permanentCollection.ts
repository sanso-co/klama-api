import mongoose from "mongoose";

import { PermanentType } from "../interfaces/permanentCollection";

const permanentCollection = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
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

export default mongoose.model<PermanentType>("PermanentCollection", permanentCollection);
