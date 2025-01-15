import mongoose from "mongoose";

import { PeriodicType } from "../interfaces/periodicCollection";

const periodicCollection = new mongoose.Schema(
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
            enum: ["weekly", "monthly", "quarterly"],
        },
        lists: [
            {
                releaseDate: {
                    type: Date,
                    required: true,
                },
                shows: [
                    {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Show",
                    },
                ],
            },
        ],
    },
    { timestamps: true }
);

export default mongoose.model<PeriodicType>("PeriodicCollection", periodicCollection);
