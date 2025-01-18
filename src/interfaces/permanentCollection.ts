import { Document } from "mongoose";
import { IShow } from "./show";

export interface PermanentType extends Document {
    name: string;
    description?: string;
    shows: IShow[];
}
