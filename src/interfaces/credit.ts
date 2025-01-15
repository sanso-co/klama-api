import { Document } from "mongoose";
import { ShowType } from "./show";

export interface CreditType extends Document {
    id: number;
    name?: string;
    original_name?: string;
    job?: string;
    shows: ShowType[];
}
