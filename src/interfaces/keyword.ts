import mongoose, { Document } from "mongoose";

export interface IKeyword extends Document {
    _id: mongoose.Types.ObjectId;
    id: number;
    name: string;
    original_name?: string;
    rank: number;
}
