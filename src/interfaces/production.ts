import mongoose, { Document } from "mongoose";

export interface ProductionType extends Document {
    _id: mongoose.Types.ObjectId;
    id: number;
    name: string;
    original_name?: string;
    logo_path?: string;
}
