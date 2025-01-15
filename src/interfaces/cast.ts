import { Document } from "mongoose";
import { PersonType } from "./person";

export interface CastType extends Document {
    id: number;
    casts: {
        person: PersonType;
        role: string;
        original_role: string;
        order: number;
    }[];
}
