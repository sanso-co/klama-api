import mongoose from "mongoose";

import { UserType } from "../interfaces/user";

type UserDocument = mongoose.Document & {
    googleId?: string;
};

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        username: {
            type: String,
            unique: true,
            sparse: true,
        },
        password: {
            type: String,
            required: function (this: UserDocument) {
                return !this.googleId;
            },
        },
        googleId: {
            type: String,
            unique: true,
            sparse: true,
        },
        avatar: {
            type: String,
            default: null,
        },
        isProfileComplete: {
            type: Boolean,
            default: false,
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export default mongoose.model<UserType>("User", userSchema);
