import mongoose, { Document } from "mongoose";

export interface IHero extends Document {
    order: number;
    title: string;
    tag?: {
        label: string;
        color: string;
    };
    url?: string;
    img?: string;
    tagline?: string;
}
