import mongoose from "mongoose";

import { IHero } from "../interfaces/hero";

const heroSchema = new mongoose.Schema(
    {
        order: {
            type: Number,
            required: true,
            unique: true,
        },
        title: {
            type: String,
            required: true,
        },
        tag: {
            label: {
                type: String,
            },
            color: {
                type: String,
            },
        },
        url: {
            type: String,
        },
        img: {
            type: String,
        },
        tagline: {
            type: String,
        },
    },
    { timestamps: true }
);

export default mongoose.model<IHero>("Hero", heroSchema);
