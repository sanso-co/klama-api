import { RequestHandler } from "express";
import { SortOrder, Types } from "mongoose";

import { DocumentType } from "../interfaces/document";
import { PaginationResponseType, RequestQuery } from "../interfaces/api";
import { ShowFindType, IShow, ITMDBShow, ITrailer } from "../interfaces/show";

import Show from "../models/show";
import Genre from "../models/genre";
import Keyword from "../models/keyword";
import Network from "../models/network";
import Production from "../models/production";
import Credit from "../models/credit";
import ShowType from "../models/showType";
import Tone from "../models/tone";

import { getSortOptions } from "../utilities/sortUtils";
import { paginatedResult } from "../utilities/paginateUtils";
import { genreMapping } from "../helper/genre";
import { IKeyword } from "../interfaces/keyword";
import { IGenre } from "../interfaces/genre";
import { ITone } from "../interfaces/tone";

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
        // .populate({
        //     path: "original_story.author",
        //     model: "Credit",
        // });

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
            const genreDocument = (await Genre.findOne({
                id,
            })) as DocumentType | null;
            if (genreDocument) {
                query.genres = genreDocument._id;
            } else {
                res.status(404).json({ message: "Genre not found" });
                return;
            }
        }

        if (category === "keyword") {
            const keywordDocument = (await Keyword.findOne({
                id,
            })) as DocumentType | null;
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

interface AddBody {
    show: ITMDBShow;
}

export const addShow: RequestHandler<{}, {}, AddBody, {}> = async (req, res) => {
    const { show: tmdbShow } = req.body;

    try {
        const existingShow = await Show.findOne({ id: tmdbShow.id });

        if (existingShow) {
            res.status(400).json("Show already exists");
            return;
        }
        const showData: Partial<IShow> = {
            id: tmdbShow.id,
            name: tmdbShow.name,
            original_name: tmdbShow.original_name,
            poster_path: tmdbShow.poster_path,
            overview: tmdbShow.overview,
            first_air_date: tmdbShow.first_air_date,
            number_of_episodes: tmdbShow.number_of_episodes,
            homepage: tmdbShow.homepage,
        };
        const genreIds = await Promise.all(
            tmdbShow.genres.map(async (item) => {
                const mappedGenreId = genreMapping[item.id];

                if (mappedGenreId) {
                    let genre = await Genre.findOne({ id: mappedGenreId });

                    if (genre) {
                        return genre._id;
                    } else {
                        return null;
                    }
                } else {
                    return null;
                }
            })
        );

        showData.genres = genreIds.filter(Boolean) as Types.ObjectId[];
        const networkIds = await Promise.all(
            tmdbShow.networks.map(async (networkItem) => {
                let network = await Network.findOne({ id: networkItem.id });
                if (!network) {
                    network = await Network.create({
                        id: networkItem.id,
                        name: networkItem.name,
                        logo_path: networkItem.logo_path,
                    });
                }
                return network._id;
            })
        );

        showData.networks = networkIds;
        const productionIds = await Promise.all(
            tmdbShow.production_companies.map(async (productionItem) => {
                let production = await Production.findOne({
                    id: productionItem.id,
                });
                if (!production) {
                    production = await Production.create({
                        id: productionItem.id,
                        name: productionItem.name,
                        logo_path: productionItem.logo_path,
                    });
                }
                return production._id;
            })
        );

        showData.production_companies = productionIds;
        const creditIds = await Promise.all(
            tmdbShow.created_by.map(async (creditItem) => {
                let credit = await Credit.findOne({ id: creditItem.id });
                if (!credit) {
                    credit = await Credit.create({
                        id: creditItem.id,
                        name: creditItem.name,
                        original_name: creditItem.original_name,
                        job: "",
                    });
                }
                return credit._id;
            })
        );

        showData.credits = creditIds;
        let showType = await ShowType.findOne({ id: 1 });
        if (showType) {
            showData.show_type = showType._id;
        }
        const newShow = await Show.create(showData);
        res.status(200).json(newShow);
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const updateShow: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const updates: {
        keywords?: IKeyword[];
        genres?: IGenre[];
        trailer?: ITrailer;
        tones?: ITone[];
    } = req.body;

    try {
        const { trailer, ...restUpdates } = updates;
        let updatedData: Partial<IShow> = { ...restUpdates };

        if (updates.genres) {
            const genreIds = await Promise.all(
                updates.genres.map(async (item) => {
                    let genre = await Genre.findOne({ id: item.id });
                    if (!genre) {
                        genre = await Genre.create({
                            name: item.name,
                            original_name: item.original_name,
                            id: item.id,
                        });
                    }
                    return genre._id;
                })
            );
            updatedData.genres = genreIds;
        }

        if (updates.keywords) {
            const keywordIds = await Promise.all(
                updates.keywords.map(async (item) => {
                    let keyword = await Keyword.findOne({ id: item.id });
                    if (!keyword) {
                        keyword = await Keyword.create({
                            name: item.name,
                            original_name: item.original_name,
                            id: item.id,
                        });
                    }
                    return keyword._id;
                })
            );
            updatedData.keywords = keywordIds;
        }

        if (updates.tones) {
            const toneIds = await Promise.all(
                updates.tones.map(async (item) => {
                    let tone = await Tone.findOne({ id: item.id });
                    if (!tone) {
                        tone = await Tone.create({
                            name: item.name,
                            original_name: item.original_name,
                            id: item.id,
                        });
                    }
                    return tone._id;
                })
            );
            updatedData.tones = toneIds;
        }

        if (trailer) {
            updatedData.trailer = [
                {
                    key: trailer.key,
                    site: trailer.site,
                },
            ];
        }

        const updatedShow = await Show.findOneAndUpdate(
            { id: id },
            { $set: updatedData },
            { new: true, runValidators: true }
        );

        if (!updatedShow) {
            res.status(404).json({ message: "Show not found" });
            return;
        }
        res.status(200).json(updatedShow);
    } catch (error) {
        res.status(500).json({ error });
    }
};
