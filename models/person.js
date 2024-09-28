import mongoose from "mongoose";

const personSchema = mongoose.Schema(
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
        profile_path: {
            type: String,
        },
        known_for_department: {
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

export default mongoose.model("Person", personSchema);
