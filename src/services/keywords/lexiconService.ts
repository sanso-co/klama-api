// Lexicon loading/providing (kept in memory)
import KeywordLexicon from "../../models/keywordLexicon";
import { normalizeLexiconItem, LexiconItem } from "../../utilities/lexiconUtils";

let LEXICON: LexiconItem[] | null = null;

/** ① Load Lexicon (JSON → memory) */
export async function ensureLexicon(): Promise<void> {
    if (LEXICON) return;
    // Adjust the path to match your project structure
    const docs = await KeywordLexicon.find({}).lean();
    LEXICON = docs.map(normalizeLexiconItem);
}

/** ② Get Lexicon */
export function getLexicon(): LexiconItem[] {
    if (!LEXICON) throw new Error("Lexicon not loaded");
    return LEXICON;
}
