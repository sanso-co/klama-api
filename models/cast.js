import mongoose from "mongoose";

const castSchema = mongoose.Schema(
    {
        id: {
            type: Number,
            required: true,
            unique: true,
        },
        casts: [
            {
                person: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Person",
                    required: true,
                },
                role: {
                    type: String,
                },
                original_role: {
                    type: String,
                    default: "",
                },
                order: {
                    type: Number,
                },
            },
        ],
    },
    { timestamps: true }
);

castSchema.index({ id: 1 }, { unique: true });

export default mongoose.model("Cast", castSchema);
