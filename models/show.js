import mongoose from "mongoose";

const showSchema = mongoose.Schema(
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
            required: true,
        },
        poster_path: {
            type: String,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Show", showSchema);
