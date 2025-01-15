import { Document } from "mongoose";
import { ShowType } from "./show";

export interface PeriodicType extends Document {
    name: string;
    description?: string;
    frequency: "weekly" | "monthly" | "quarterly";
    lists: {
        releaseDate: Date;
        shows: ShowType[];
    }[];
}
