import { Document } from "mongoose";
import { ShowType } from "./show";

export interface PersonType extends Document {
    id: number;
    name: string;
    original_name?: string;
    profile_path?: string;
    known_for_department?: string;
    shows: ShowType[];
}
