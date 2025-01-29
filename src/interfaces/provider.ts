import mongoose, { Document } from "mongoose";

export interface ProviderType extends Document {
    id: number;
    name: string;
    logo_path?: string;
    display_priority?: number;
    shows: mongoose.Types.ObjectId[];
}
