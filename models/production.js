import mongoose from "mongoose";

const productionSchema = mongoose.Schema(
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
        logo_path: {
            type: String,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Production", productionSchema);
