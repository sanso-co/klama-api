import mongoose, { Document } from "mongoose";
import { IShow } from "./show";

export interface ICredit extends Document {
    _id: mongoose.Types.ObjectId;
    id: number;
    name: string;
    original_name?: string;
    job?: string;
    shows: IShow[];
}
