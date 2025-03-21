import { IGenre } from "../interfaces/genre";
import { IKeyword } from "../interfaces/keyword";
import { ITone } from "../interfaces/tone";
import Show from "../models/show";

const KEYWORD_WEIGHT = 2;
const TONE_WEIGHT = 10;

export const calculateSimilarity = async (showId: string) => {
    const targetShow = await Show.findOne({ id: showId })
        .populate<{ keywords: IKeyword[]; genres: IGenre[] }>("genres keywords")
        .exec();

    if (!targetShow) {
        throw new Error("Show not found");
    }

    const targetKeywordIds = targetShow.keywords.map((keyword) => keyword._id);
    const targetGenreIds = targetShow.genres.map((genre) => genre._id);

    // Pre-filter shows based on shared genres or keywords
    const filteredShows = await Show.find({
        _id: { $ne: targetShow._id },
        $or: [{ genres: { $in: targetGenreIds } }, { keywords: { $in: targetKeywordIds } }],
    })
        .populate<{ keywords: IKeyword[]; genres: IGenre[]; tones: ITone[] }>(
            "genres keywords tones"
        )
        .exec();

    const similarityScores = filteredShows.map((show) => {
        let keywordSimilarity = 0;
        let toneSimilarity = 0;
        let genreSimilarity = 0;

        // Calculate Keyword Similarity
        show.keywords.forEach((keyword: IKeyword) => {
            if (keyword.id < 2000) {
                const matchingKeyword = targetShow.keywords.find((tkw) =>
                    tkw._id.equals(keyword._id)
                );
                if (matchingKeyword) {
                    keywordSimilarity += matchingKeyword.rank * KEYWORD_WEIGHT;
                }
            }
        });

        show.genres.forEach((genre) => {
            const matchingGenre = targetShow.genres.find((tgenre) => tgenre._id.equals(genre._id));
            if (matchingGenre) {
                genreSimilarity += matchingGenre.rank; // Use rank/weight of the genre
            }
        });

        show.tones.forEach((tone: ITone) => {
            const matchingTone = targetShow.tones.find((ttone) => ttone._id.equals(tone._id));
            if (matchingTone) {
                toneSimilarity += TONE_WEIGHT;
            }
        });

        const totalSimilarity = keywordSimilarity + genreSimilarity + toneSimilarity;

        return {
            id: show.id,
            name: show.name,
            original_name: show.original_name,
            poster_path: show.poster_path,
            first_air_date: show.first_air_date,
            popularity_score: show.popularity_score,
            similarity_score: totalSimilarity,
        };
    });

    // Sort by similarity score
    similarityScores.sort((a, b) => b.similarity_score - a.similarity_score);

    return similarityScores.slice(0, 10);
};
