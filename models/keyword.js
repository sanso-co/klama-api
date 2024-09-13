import mongoose from "mongoose";

const keywordSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        id: {
            type: Number,
            required: true,
        },
        rank: {
            type: Number,
            default: 999,
        },
    },
    { timestamps: true }
);

export default mongoose.model("keyword", keywordSchema);
