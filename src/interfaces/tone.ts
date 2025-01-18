import { Document } from "mongoose";

export interface ITone extends Document {
    id: number;
    name: string;
    original_name?: string;
    rank?: number;
}
