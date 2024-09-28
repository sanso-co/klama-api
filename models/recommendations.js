import mongoose from "mongoose";

const recommendations = mongoose.Schema(
    {
        id: {
            type: Number,
            required: true,
        },
        details: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Show",
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

export default mongoose.model("Recommendations", recommendations);
