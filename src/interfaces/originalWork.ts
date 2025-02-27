import mongoose, { Document } from "mongoose";
import { ICredit } from "./credit";

export interface IOriginalWork extends Document {
    _id: mongoose.Types.ObjectId;
    title: string;
    original_title: string;
    author: ICredit;
    type: string;
    published_year: number;
    shows: mongoose.Types.ObjectId[];
}
