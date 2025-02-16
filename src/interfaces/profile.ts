import { Document } from "mongoose";

export interface IProfile extends Document {
    about: string;
    email: string;
}
