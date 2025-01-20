import { RequestHandler } from "express";
import Show from "../models/show";
import UserShows from "../models/userShows";
import { ShowFindType } from "../interfaces/show";
import { SortOrder, Types } from "mongoose";
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
                wishlisted: false,
            });
            return;
        }

        res.status(200).json({
            showId,
            liked: userShow.liked,
            disliked: userShow.disliked,
            watched: userShow.watched,
            wishlisted: userShow.wishlisted,
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
    wishlisted?: boolean;
}

export const getShowsByCategory: RequestHandler = async (req: any, res) => {
    try {
        const { category } = req.params; // 'liked', 'disliked', 'watched', or 'wishlisted'
        const { page = "1", limit = "30", sort = "name_asc" } = req.query;
        const userId = req.user?._id;

        if (!userId) {
            res.status(401).json({
                message: "User not authenticated",
            });
            return;
        }

        const validCategories = ["liked", "disliked", "watched", "watchlist"];
        if (!validCategories.includes(category)) {
            res.status(400).json({
                message: "Invalid category. Must be one of: liked, disliked, watched, watchlist",
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
            case "watchlist":
                query.wishlisted = true;
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

export const markWatched: RequestHandler = async (req: any, res) => {
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
            showId,
            watched: true,
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

export const toggleWishlist: RequestHandler = async (req: any, res) => {
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
            if (userShow.wishlisted) {
                userShow.wishlisted = false;
            } else {
                userShow.wishlisted = true;
            }
            await userShow.save();
        } else {
            userShow = await UserShows.create({
                user: userId,
                show: thisShow._id,
                wishlisted: true,
            });
        }

        res.status(200).json({
            userShow,
        });
    } catch (error) {
        res.status(500).json(error);
    }
};
