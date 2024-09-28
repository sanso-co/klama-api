import mongoose from "mongoose";

const showTypeSchema = mongoose.Schema(
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

export default mongoose.model("ShowType", showTypeSchema);
