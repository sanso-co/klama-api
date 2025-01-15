import mongoose, { Document } from "mongoose";

export interface HeroType extends Document {
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
