import mongoose, { Document } from "mongoose";

export interface IRole {
    person: mongoose.Types.ObjectId;
    role: string;
    original_role: string;
    order: number;
}

export interface ICast extends Document {
    id: number;
    casts: IRole[];
}
