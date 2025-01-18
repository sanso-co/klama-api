import mongoose, { Document } from "mongoose";
import { IShow } from "./show";

export interface IPerson extends Document {
    _id: mongoose.Types.ObjectId;
    id: number;
    name: string;
    original_name?: string;
    profile_path?: string;
    known_for_department?: string;
    shows: mongoose.Types.ObjectId[];
}
