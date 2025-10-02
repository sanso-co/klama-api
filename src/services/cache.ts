// Tone/Keyword name → ObjectId cache (system-level service)

import { Types } from "mongoose";
import Tone from "../models/tone";
import Keyword from "../models/keyword";
import { norm } from "../utilities/textUtils";

let KEYWORD_NAME_TO_ID: Map<string, Types.ObjectId> | null = null;
let TONE_NAME_TO_ID: Map<string, Types.ObjectId> | null = null;

/** ① Cache loading: map Keyword/Tone names to ObjectIds */
export async function ensureCaches(): Promise<void> {
    // (1) Keyword cache
    if (!KEYWORD_NAME_TO_ID) {
        KEYWORD_NAME_TO_ID = new Map();
        const keywordDocs = await Keyword.find({}).select("_id name original_name").lean();
        for (const keyword of keywordDocs) {
            const objectId = keyword._id as Types.ObjectId;
            if (keyword.name) KEYWORD_NAME_TO_ID.set(norm(keyword.name), objectId);
            if (keyword.original_name)
                KEYWORD_NAME_TO_ID.set(norm(keyword.original_name), objectId);
        }
    }

    // (2) Tone cache
    if (!TONE_NAME_TO_ID) {
        TONE_NAME_TO_ID = new Map();
        const toneDocs = await Tone.find({}).select("_id name original_name").lean();
        for (const tone of toneDocs) {
            const objectId = tone._id as Types.ObjectId;
            if (tone.name) TONE_NAME_TO_ID.set(norm(tone.name), objectId);
            if (tone.original_name) TONE_NAME_TO_ID.set(norm(tone.original_name), objectId);
        }
    }
}

/** ② Find Tone ObjectId (use cache first, fallback to loose DB lookup) */
export async function getToneObjectIdByNameLoose(toneName: string): Promise<Types.ObjectId | null> {
    await ensureCaches();
    const key = norm(toneName);
    const cached = TONE_NAME_TO_ID!.get(key);
    if (cached) return cached;

    // Fallback: query DB if not in cache
    const one = await Tone.findOne({
        $or: [
            { name: new RegExp(`^${toneName}$`, "i") },
            { original_name: new RegExp(`^${toneName}$`, "i") },
        ],
    })
        .select("_id")
        .lean();

    return (one?._id as Types.ObjectId) ?? null;
}

/** ③ Find a single Keyword ObjectId by name (if needed) */
export function getKeywordObjectIdByName(keywordName: string): Types.ObjectId | null {
    if (!KEYWORD_NAME_TO_ID) return null;
    return KEYWORD_NAME_TO_ID.get(norm(keywordName)) || null;
}

/** ④ Reset caches (for testing or reload) */
export function clearCaches(): void {
    KEYWORD_NAME_TO_ID = null;
    TONE_NAME_TO_ID = null;
}
