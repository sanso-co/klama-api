import mongoose from "mongoose";

import { IProfile } from "../interfaces/profile";

const profileSchema = new mongoose.Schema(
    {
        about: {
            type: String,
            required: true,
            maxLength: 50000,
            trim: true,
            default: "",
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            validate: {
                validator: function (v: string) {
                    return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
                },
                message: "Please enter a valid email address",
            },
        },
    },
    { timestamps: true }
);

export default mongoose.model<IProfile>("Profile", profileSchema);
