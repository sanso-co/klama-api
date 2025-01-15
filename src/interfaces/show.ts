import mongoose, { Document, Types } from "mongoose";
import { KeywordType } from "./keyword";
import { GenreType } from "./genre";

interface RelatedSeason {
    season: number;
    show: mongoose.Types.ObjectId;
}

interface PosterPath {
    path?: string;
}

interface RegionalPosterPaths {
    US: PosterPath;
    KR: PosterPath;
}

interface Trailer {
    key?: string;
    site?: string;
}

interface Author {
    name?: string;
    korean_name?: string;
}

interface Title {
    title?: string;
    korean_title?: string;
}

interface OriginalStory {
    author: Author;
    title: Title;
}

export interface ShowType extends Document {
    id: number;
    name: string;
    original_name: string;
    season_number: number;
    related_seasons: RelatedSeason[];
    poster_path: RegionalPosterPaths;
    trailer: Trailer[];
    genres: GenreType[];
    keywords: KeywordType[];
    tones: mongoose.Types.ObjectId[];
    credits: mongoose.Types.ObjectId[];
    overview?: string;
    original_overview?: string;
    first_air_date: Date;
    number_of_episodes?: number;
    homepage?: string;
    networks: mongoose.Types.ObjectId[];
    production_companies: mongoose.Types.ObjectId[];
    show_type: mongoose.Types.ObjectId;
    original_story: OriginalStory;
    popularity_score: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface ShowFindType {
    genres?: Types.ObjectId | string;
    keywords?: { $in: (Types.ObjectId | string)[] };
    tones?: Types.ObjectId | string;
    first_air_date?: {
        $gte?: Date;
        $lte?: Date;
    };
}
