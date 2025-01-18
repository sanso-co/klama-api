import mongoose, { Document } from "mongoose";
import { IShow } from "./show";

export interface PeriodicType extends Document {
    name: string;
    description?: string;
    frequency: "weekly" | "monthly" | "quarterly";
    lists: {
        releaseDate: Date;
        shows: mongoose.Types.ObjectId[];
    }[];
}

export interface PopulatedPeriodicList {
    releaseDate: Date;
    shows: IShow[];
}

export interface PopulatedPeriodicType extends Omit<PeriodicType, "lists"> {
    lists: PopulatedPeriodicList[];
}
