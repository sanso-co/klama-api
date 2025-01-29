import mongoose, { Document } from "mongoose";
import { IPerson } from "./person";

export interface IRole {
    person: mongoose.Types.ObjectId | IPerson;
    role: string;
    original_role: string;
    name: string;
    order: number;
}

export interface ICast extends Document {
    id: number;
    casts: IRole[];
}
