import mongoose, { Document } from "mongoose";

export interface IKeyword extends Document {
    _id: mongoose.Types.ObjectId;
    id: number;
    name: string;
    original_name?: string;
    rank: number;
}

export interface IKeywordLexicon extends Document {
    tag_id: string;
    matches: string[];
    variants?: string[];
    synonyms?: string[];
    negatives?: string[];
}
