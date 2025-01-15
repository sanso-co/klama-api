import { Document } from "mongoose";
import { ShowType } from "./show";

export interface PermanentType extends Document {
    name: string;
    description?: string;
    shows: ShowType[];
}
