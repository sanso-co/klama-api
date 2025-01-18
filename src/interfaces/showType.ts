import mongoose, { Document } from "mongoose";

export interface IShowType extends Document {
    _id: mongoose.Types.ObjectId;
    id: number;
    name: string;
    original_name?: string;
}
