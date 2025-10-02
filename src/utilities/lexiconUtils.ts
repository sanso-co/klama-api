// Lexicon type / cleaning utility

import { norm } from "./textUtils";

export type LexiconItem = {
    tag_id: string; // e.g., "enemies_to_lovers"
    matches: string[]; // main matching expressions
    variants?: string[]; // alternative/variant expressions
    synonyms?: string[]; // similar meaning expressions
    negatives?: string[]; // exclusion expressions (not used in this scope)
};

export function normalizeLexiconItem(item: LexiconItem): LexiconItem {
    const uniq = (arr?: string[]) =>
        Array.from(new Set((arr || []).map((x) => norm(x)).filter(Boolean)));
    return {
        tag_id: norm(item.tag_id),
        matches: uniq(item.matches),
        variants: uniq(item.variants),
        synonyms: uniq(item.synonyms),
        negatives: uniq(item.negatives),
    };
}
