// question → keyword 추출, tag_id → Keyword(ObjectId) 변환

import { Types } from "mongoose";
import { getLexicon } from "./lexiconService";
import { textNormalizeForMatch, norm } from "../../utilities/textUtils";
import Keyword from "../../models/keyword";
import { ensureCaches } from "../cache";

type KeywordMatchDebug = {
    tag_id: string;
    hit: string;
    source: "match" | "variant" | "synonym";
};

export type KeywordMatchResult = {
    includeTagIds: string[]; // lexicon tag_id 배열
    debugHits?: KeywordMatchDebug[]; // 매칭 근거(옵션)
};

/** ① question에서 lexicon 기반으로 키워드(tag_id) 추출 */
export function extractKeywordsFromQuestion(questionText: string): KeywordMatchResult {
    const lexicon = getLexicon();
    const normalizedText = textNormalizeForMatch(questionText);
    const includeTagIdSet = new Set<string>();
    const debugHits: KeywordMatchDebug[] = [];

    for (const item of lexicon) {
        const baskets: ["match" | "variant" | "synonym", string[]][] = [
            ["match", item.matches],
            ["variant", item.variants || []],
            ["synonym", item.synonyms || []],
        ];
        let foundForThisTag = false;

        for (const [source, phrases] of baskets) {
            for (const phrase of phrases) {
                if (!phrase) continue;
                if (normalizedText.includes(phrase)) {
                    includeTagIdSet.add(item.tag_id);
                    debugHits.push({ tag_id: item.tag_id, hit: phrase, source });
                    foundForThisTag = true;
                    break;
                }
            }
            if (foundForThisTag) break;
        }
    }

    return {
        includeTagIds: Array.from(includeTagIdSet),
        debugHits,
    };
}

/** ② tag_id[] → Keyword(ObjectId[]) 변환 */
export async function resolveKeywordObjectIds(tagIds: string[]): Promise<Types.ObjectId[]> {
    await ensureCaches(); // 캐시 보장
    if (!tagIds.length) return [];

    // 1) tag_id가 Keyword.name/original_name과 동일한 경우 바로 매핑 시도
    const directHits = await Keyword.find({
        $or: [{ name: { $in: tagIds } }, { original_name: { $in: tagIds } }],
    })
        .select("_id name original_name")
        .lean();

    const objectIdSet = new Set<Types.ObjectId>(directHits.map((doc) => doc._id as Types.ObjectId));

    // 2) 누락된 tag_id는 느슨 조회(소문자 비교)
    const remaining = tagIds.filter(
        (t) =>
            !directHits.some(
                (doc) =>
                    norm(doc.name || "") === norm(t) || norm(doc.original_name || "") === norm(t)
            )
    );

    if (remaining.length) {
        const allKeywords = await Keyword.find({}).select("_id name original_name").lean();
        for (const tag of remaining) {
            const lt = norm(tag);
            const hit = allKeywords.find(
                (doc) => norm(doc.name || "") === lt || norm(doc.original_name || "") === lt
            );
            if (hit?._id) objectIdSet.add(hit._id as Types.ObjectId);
        }
    }

    return Array.from(objectIdSet);
}
