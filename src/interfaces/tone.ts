import mongoose, { Document } from "mongoose";

export interface ToneType extends Document {
    id: number;
    name: string;
    original_name?: string;
    rank?: number;
}
