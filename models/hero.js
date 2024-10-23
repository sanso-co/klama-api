import mongoose from "mongoose";

const heroSchema = mongoose.Schema(
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
    },
    { timestamps: true }
);

export default mongoose.model("Hero", heroSchema);
