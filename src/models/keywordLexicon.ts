import mongoose from "mongoose";

import { IKeywordLexicon } from "../interfaces/keyword";

const keywordLexiconSchema = new mongoose.Schema(
    {
        tag_id: {
            type: String,
            required: true,
            unique: true,
        },
        matches: {
            type: [String],
            default: [],
        },
        variants: {
            type: [String],
            default: [],
        },
        synonyms: {
            type: [String],
            default: [],
        },
        negatives: {
            type: [String],
            default: [],
        },
    },
    { timestamps: true }
);

export default mongoose.model<IKeywordLexicon>("KeywordLexicon", keywordLexiconSchema);
