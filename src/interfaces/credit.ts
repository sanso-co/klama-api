import mongoose, { Document } from "mongoose";

export interface ICredit extends Document {
    _id: mongoose.Types.ObjectId;
    id: number;
    name: string;
    original_name?: string;
    job?: string;
    shows: mongoose.Types.ObjectId[];
}
