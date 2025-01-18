import mongoose from "mongoose";

import { IShowType } from "../interfaces/showType";

const showTypeSchema = new mongoose.Schema(
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
    },
    { timestamps: true }
);

export default mongoose.model<IShowType>("ShowType", showTypeSchema);
