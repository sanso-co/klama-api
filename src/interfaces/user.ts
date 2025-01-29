import { Document } from "mongoose";

export interface UserType extends Document {
    username: string;
    email: string;
    password: string;
    googleId?: string;
    avatar: string | null;
    isProfileComplete: boolean;
    isAdmin: boolean;
    refreshToken: string | null;
}
