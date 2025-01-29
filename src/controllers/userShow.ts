import { RequestHandler } from "express";
import Show from "../models/show";
import UserShows from "../models/userShows";
import { ShowFindType } from "../interfaces/show";
import mongoose, { SortOrder, Types } from "mongoose";
import { paginatedResult } from "../utilities/paginateUtils";

export const getShowStatus: RequestHandler = async (req: any, res) => {
    try {
        const { showId } = req.params;
        const userId = req.user?._id;

        if (!userId) {
            res.status(401).json({
                message: "User not authenticated",
            });
            return;
        }

        const thisShow = await Show.findOne({ id: showId });

        if (!thisShow) {
            res.status(404).json({
                message: "Show not found",
            });
            return;
        }

        const userShow = await UserShows.findOne({
            user: userId,
            show: thisShow._id,
        });

        if (!userShow) {
            res.status(200).json({
                showId,
                liked: false,
                disliked: false,
                watched: false,
                bookmarked: false,
            });
            return;
        }

        res.status(200).json({
            showId,
            liked: userShow.liked,
            disliked: userShow.disliked,
            watched: userShow.watched,
            bookmarked: userShow.bookmarked,
        });
    } catch (error) {
        res.status(500).json(error);
    }
};

interface IUserShowFind {
    user: Types.ObjectId | string;
    liked?: boolean;
    disliked?: boolean;
    watched?: boolean;
    bookmarked?: boolean;
}

export const getShowsByCategory: RequestHandler = async (req: any, res) => {
    try {
        const { category } = req.params; // 'liked', 'disliked', 'watched', or 'bookmarked'
        const { page = "1", limit = "30", sort = "name_asc" } = req.query;
        const userId = req.user?._id;

        if (!userId) {
            res.status(401).json({
                message: "User not authenticated",
            });
            return;
        }

        const validCategories = ["liked", "disliked", "watched", "bookmarked"];
        if (!validCategories.includes(category)) {
            res.status(400).json({
                message: "Invalid category. Must be one of: liked, disliked, watched, bookmarked",
            });
            return;
        }

        const query: IUserShowFind = { user: userId };
        switch (category) {
            case "liked":
                query.liked = true;
                break;
            case "disliked":
                query.disliked = true;
                break;
            case "watched":
                query.watched = true;
                break;
            case "bookmarked":
                query.bookmarked = true;
                break;
        }

        const sortOption: { [key: string]: SortOrder } =
            sort === "date_desc"
                ? { first_air_date: -1 as SortOrder }
                : { original_name: 1 as SortOrder };

        const categoryShows = await UserShows.find(query)
            .populate({
                path: "show",
                model: "Show",
                select: "_id id name original_name poster_path first_air_date popularity_score",
            })
            .select("-_id show")
            .sort(sortOption)
            .lean()
            .then((shows) => shows.map((item) => item.show));

        const response = paginatedResult(categoryShows, { page, limit });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error);
    }
};

export const getUserShowCounts: RequestHandler = async (req: any, res) => {
    try {
        const userId = req.user?._id;

        if (!userId) {
            res.status(401).json({
                message: "User not authenticated",
            });
            return;
        }

        const likedCount = await UserShows.countDocuments({ user: userId, liked: true });
        const dislikedCount = await UserShows.countDocuments({ user: userId, disliked: true });
        const watchedCount = await UserShows.countDocuments({ user: userId, watched: true });
        const bookmarkedCount = await UserShows.countDocuments({ user: userId, bookmarked: true });

        // Get last 4 liked shows
        const likedShows = await UserShows.find({ user: userId, liked: true })
            .populate({
                path: "show",
                model: "Show",
                select: "_id id name original_name poster_path first_air_date popularity_score",
            })
            .select("-_id show")
            .sort({ createdAt: -1 })
            .limit(4)
            .lean()
            .then((shows) => shows.map((item) => item.show));

        // Get last 4 bookmarked shows
        const bookmarkedShows = await UserShows.find({ user: userId, bookmarked: true })
            .populate({
                path: "show",
                model: "Show",
                select: "_id id name original_name poster_path first_air_date popularity_score",
            })
            .select("-_id show")
            .sort({ createdAt: -1 })
            .limit(4)
            .lean()
            .then((shows) => shows.map((item) => item.show));

        const response = {
            liked: {
                count: likedCount,
                shows: likedShows,
            },
            disliked: dislikedCount,
            watched: watchedCount,
            bookmarked: {
                count: bookmarkedCount,
                shows: bookmarkedShows,
            },
        };

        res.status(200).json(response);
    } catch (error) {
        console.error("Error in getUserShowCounts:", error);
        res.status(500).json(error);
    }
};

export const toggleWatch: RequestHandler = async (req: any, res) => {
    try {
        const { showId } = req.params;
        const userId = req.user?._id;

        if (!userId) {
            res.status(401).json({
                message: "User not authenticated",
            });
            return;
        }

        const thisShow = await Show.findOne({ id: showId });

        if (!thisShow) {
            res.status(404).json({
                message: "Show not found",
            });
            return;
        }

        let userShow = await UserShows.findOne({
            user: userId,
            show: thisShow._id,
        });

        if (userShow) {
            userShow.watched = true;
            await userShow.save();
        } else {
            userShow = await UserShows.create({
                user: userId,
                show: thisShow._id,
                watched: true,
            });
        }

        res.status(200).json({
            userShow,
        });
    } catch (error) {
        res.status(500).json(error);
    }
};

export const toggleLike: RequestHandler = async (req: any, res) => {
    try {
        const { showId } = req.params;
        const userId = req.user?._id;

        if (!userId) {
            res.status(401).json({
                message: "User not authenticated",
            });
            return;
        }

        const thisShow = await Show.findOne({ id: showId });

        if (!thisShow) {
            res.status(404).json({
                message: "Show not found",
            });
            return;
        }

        let userShow = await UserShows.findOne({
            user: userId,
            show: thisShow._id,
        });

        if (userShow) {
            if (userShow.liked) {
                userShow.liked = false;
            } else {
                userShow.liked = true;
                userShow.disliked = false;
            }
            await userShow.save();
        } else {
            userShow = await UserShows.create({
                user: userId,
                show: thisShow._id,
                liked: true,
                disliked: false,
            });
        }

        res.status(200).json({
            userShow,
        });
    } catch (error) {
        res.status(500).json(error);
    }
};

export const toggleDislike: RequestHandler = async (req: any, res) => {
    try {
        const { showId } = req.params;
        const userId = req.user?._id;

        if (!userId) {
            res.status(401).json({
                message: "User not authenticated",
            });
            return;
        }

        const thisShow = await Show.findOne({ id: showId });

        if (!thisShow) {
            res.status(404).json({
                message: "Show not found",
            });
            return;
        }

        let userShow = await UserShows.findOne({
            user: userId,
            show: thisShow._id,
        });

        if (userShow) {
            if (userShow.disliked) {
                userShow.disliked = false;
            } else {
                userShow.disliked = true;
                userShow.liked = false;
            }
            await userShow.save();
        } else {
            userShow = await UserShows.create({
                user: userId,
                show: thisShow._id,
                disliked: true,
                liked: false,
            });
        }

        res.status(200).json({
            userShow,
        });
    } catch (error) {
        res.status(500).json(error);
    }
};

export const toggleBookmark: RequestHandler = async (req: any, res) => {
    try {
        const { showId } = req.params;
        const userId = req.user?._id;

        if (!userId) {
            res.status(401).json({
                message: "User not authenticated",
            });
            return;
        }

        const thisShow = await Show.findOne({ id: showId });

        if (!thisShow) {
            res.status(404).json({
                message: "Show not found",
            });
            return;
        }

        let userShow = await UserShows.findOne({
            user: userId,
            show: thisShow._id,
        });

        if (userShow) {
            if (userShow.bookmarked) {
                userShow.bookmarked = false;
            } else {
                userShow.bookmarked = true;
            }
            await userShow.save();
        } else {
            userShow = await UserShows.create({
                user: userId,
                show: thisShow._id,
                bookmarked: true,
            });
        }

        res.status(200).json({
            userShow,
        });
    } catch (error) {
        res.status(500).json(error);
    }
};
