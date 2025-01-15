import { Document, Types } from "mongoose";

export interface DocumentType extends Document {
    _id: Types.ObjectId;
    id: string;
    name: string;
}
