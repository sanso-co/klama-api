import mongoose, { Document, Types } from "mongoose";
import { IKeyword } from "./keyword";
import { IGenre } from "./genre";
import { ITone } from "./tone";
import { IOriginalWork } from "./originalWork";

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

export interface ITrailer {
    key: string;
    site: string;
}

interface Author {
    name?: string;
    korean_name?: string;
}

interface Title {
    title?: string;
    korean_title?: string;
}

export interface IShow extends Document {
    _id: mongoose.Types.ObjectId;
    id: number;
    name: string;
    original_name: string;
    overview?: string;
    original_overview?: string;
    is_custom_content?: boolean;
    first_air_date: Date;
    number_of_episodes?: number;
    season_number: number;
    homepage?: string;
    poster_path: RegionalPosterPaths;
    trailer: ITrailer[];
    original_work: mongoose.Types.ObjectId;
    related_seasons: RelatedSeason[];
    genres: mongoose.Types.ObjectId[] | IGenre[];
    credits: mongoose.Types.ObjectId[];
    networks: mongoose.Types.ObjectId[];
    production_companies: mongoose.Types.ObjectId[];
    keywords: mongoose.Types.ObjectId[] | IKeyword[];
    tones: mongoose.Types.ObjectId[] | ITone[];
    show_type: mongoose.Types.ObjectId;
    popularity_score: number;
    likes_count: number;
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

export interface ITMDBShow {
    id: number;
    name: string;
    original_name: string;
    poster_path: RegionalPosterPaths;
    genres: {
        id: number;
        name: string;
    }[];
    overview: string;
    first_air_date: Date;
    number_of_episodes: number;
    homepage: string;
    networks: {
        id: number;
        logo_path: string;
        name: string;
        origin_country: string;
    }[];
    production_companies: {
        id: number;
        logo_path: string;
        name: string;
        origin_country: string;
    }[];
    created_by: {
        id: number;
        credit_id: string;
        name: string;
        original_name: string;
        gender: number;
        profile_path: null;
    }[];
}
