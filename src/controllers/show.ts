import { RequestHandler } from "express";
import { SortOrder } from "mongoose";

import Show from "../models/show";
import Genre from "../models/genre";
import Keyword from "../models/keyword";

import { PaginationResponseType, RequestQuery } from "../interfaces/api";
import { getSortOptions } from "../utilities/sortUtils";
import { ShowFindType } from "../interfaces/show";
import { DocumentType } from "../interfaces/document";
import { paginatedResult } from "../utilities/paginateUtils";

export const getAllShow: RequestHandler<
    {},
    PaginationResponseType | { error: any },
    {},
    RequestQuery
> = async (req, res) => {
    const {
        page = "1",
        limit = "30",
        keyword = "",
        genre = "",
        tone = "",
        from = "",
        to = "",
        sort = "name_asc",
    } = req.query;

    try {
        const query: ShowFindType = {};

        if (genre) {
            query.genres = genre;
        }

        if (keyword) {
            // If keyword is comma-separated string, split it into array
            const keywordIds = keyword.includes(",")
                ? keyword.split(",")
                : Array.isArray(keyword)
                ? keyword
                : [keyword];

            // Use $in operator to match any of the keywords
            query.keywords = { $in: keywordIds };
        }

        if (tone) {
            query.tones = tone;
        }

        if (from || to) {
            query.first_air_date = {};

            if (from) {
                query.first_air_date.$gte = new Date(`${from}-01-01T00:00:00.000Z`);
            }

            if (to) {
                query.first_air_date.$lte = new Date(`${to}-12-31T23:59:59.999Z`);
            }
        }

        const sortOption: { [key: string]: SortOrder } =
            sort === "date_desc"
                ? { first_air_date: -1 as SortOrder }
                : { original_name: 1 as SortOrder };

        const shows = await Show.find(query)
            .select("id name original_name poster_path first_air_date popularity_score")
            .sort(sortOption);

        const response = paginatedResult(shows, { page, limit });

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const getShowDetails: RequestHandler = async (req, res) => {
    const { id } = req.params;

    try {
        const details = await Show.findOne({ id })
            .populate("genres")
            .populate("networks")
            .populate("keywords")
            .populate("tones")
            .populate({
                path: "related_seasons.show",
                model: "Show",
                select: "_id id name original_name season_number",
            });

        if (!details) {
            res.status(404).json({ message: "Show not found" });
            return;
        }

        res.status(200).json(details);
    } catch (error) {
        res.status(500).json(error);
    }
};

interface CategoryParams {
    category: "genre" | "keyword" | "year";
    id: string;
}

export const getShowCategoryList: RequestHandler<
    CategoryParams,
    PaginationResponseType | { message: string } | { error: any },
    {},
    RequestQuery
> = async (req, res) => {
    const { category, id } = req.params;
    const { page = "1", limit = "30", sort = "name_asc" } = req.query;

    try {
        const query: ShowFindType = {};
        const sortOptions = getSortOptions(sort);

        if (category === "genre") {
            const genreDocument = (await Genre.findOne({ id })) as DocumentType | null;
            if (genreDocument) {
                query.genres = genreDocument._id;
            } else {
                res.status(404).json({ message: "Genre not found" });
                return;
            }
        }

        if (category === "keyword") {
            const keywordDocument = (await Keyword.findOne({ id })) as DocumentType | null;
            if (keywordDocument) {
                query.keywords = { $in: [keywordDocument._id] };
            } else {
                res.status(404).json({ message: "Keyword not found" });
                return;
            }
        }

        if (category === "year") {
            const startOfYear = new Date(`${id}-01-01T00:00:00.000Z`);
            const endOfYear = new Date(`${id}-12-31T23:59:59.999Z`);
            query.first_air_date = { $gte: startOfYear, $lte: endOfYear };
        }

        const shows = await Show.find(query)
            .select("id name original_name poster_path first_air_date popularity_score")
            .sort(sortOptions);

        const response = paginatedResult(shows, { page, limit });

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const searchShow: RequestHandler<{}, {}, {}, RequestQuery> = async (req, res) => {
    const { query, limit = "10" } = req.query;

    if (!query) {
        res.status(400).json({ message: "Search query is required" });
        return;
    }

    try {
        // Convert the query to a number if it's a valid integer
        const parsedNum = Number(query);
        const idQuery = !Number.isNaN(parsedNum) ? parsedNum : null;

        // Create a regex for case-insensitive partial matching
        const regexQuery = new RegExp(query, "i");

        const searchResults = await Show.find({
            $or: [{ id: idQuery }, { name: regexQuery }, { original_name: regexQuery }],
        })
            .limit(parseInt(limit))
            .select("_id id name original_name poster_path genres first_air_date popularity_score")
            .lean();

        res.status(200).json(searchResults);
    } catch (error) {
        res.status(500).json({ error });
    }
};
