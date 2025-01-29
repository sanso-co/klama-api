"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleBookmark = exports.toggleDislike = exports.toggleLike = exports.toggleWatch = exports.getUserShowCounts = exports.getShowsByCategory = exports.getShowStatus = void 0;
const show_1 = __importDefault(require("../models/show"));
const userShows_1 = __importDefault(require("../models/userShows"));
const paginateUtils_1 = require("../utilities/paginateUtils");
const getShowStatus = async (req, res) => {
    try {
        const { showId } = req.params;
        const userId = req.user?._id;
        if (!userId) {
            res.status(401).json({
                message: "User not authenticated",
            });
            return;
        }
        const thisShow = await show_1.default.findOne({ id: showId });
        if (!thisShow) {
            res.status(404).json({
                message: "Show not found",
            });
            return;
        }
        const userShow = await userShows_1.default.findOne({
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
    }
    catch (error) {
        res.status(500).json(error);
    }
};
exports.getShowStatus = getShowStatus;
const getShowsByCategory = async (req, res) => {
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
        const query = { user: userId };
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
        const sortOption = sort === "date_desc"
            ? { first_air_date: -1 }
            : { original_name: 1 };
        const categoryShows = (await userShows_1.default.find(query)
            .populate({
            path: "show",
            model: "Show",
            select: "_id id name original_name poster_path first_air_date popularity_score",
        })
            .select("-_id show")
            .sort(sortOption)
            .lean()
            .then((shows) => shows.map((item) => item.show)));
        console.log(categoryShows);
        const response = (0, paginateUtils_1.paginatedResult)(categoryShows, { page, limit });
        res.status(200).json(response);
    }
    catch (error) {
        res.status(500).json(error);
    }
};
exports.getShowsByCategory = getShowsByCategory;
const getUserShowCounts = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            res.status(401).json({
                message: "User not authenticated",
            });
            return;
        }
        const likedCount = await userShows_1.default.countDocuments({ user: userId, liked: true });
        const dislikedCount = await userShows_1.default.countDocuments({ user: userId, disliked: true });
        const watchedCount = await userShows_1.default.countDocuments({ user: userId, watched: true });
        const bookmarkedCount = await userShows_1.default.countDocuments({ user: userId, bookmarked: true });
        // Get last 4 liked shows
        const likedShows = await userShows_1.default.find({ user: userId, liked: true })
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
        const bookmarkedShows = await userShows_1.default.find({ user: userId, bookmarked: true })
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
    }
    catch (error) {
        console.error("Error in getUserShowCounts:", error);
        res.status(500).json(error);
    }
};
exports.getUserShowCounts = getUserShowCounts;
const toggleWatch = async (req, res) => {
    try {
        const { showId } = req.params;
        const userId = req.user?._id;
        if (!userId) {
            res.status(401).json({
                message: "User not authenticated",
            });
            return;
        }
        const thisShow = await show_1.default.findOne({ id: showId });
        if (!thisShow) {
            res.status(404).json({
                message: "Show not found",
            });
            return;
        }
        let userShow = await userShows_1.default.findOne({
            user: userId,
            show: thisShow._id,
        });
        if (userShow) {
            userShow.watched = true;
            await userShow.save();
        }
        else {
            userShow = await userShows_1.default.create({
                user: userId,
                show: thisShow._id,
                watched: true,
            });
        }
        res.status(200).json({
            userShow,
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
};
exports.toggleWatch = toggleWatch;
const toggleLike = async (req, res) => {
    try {
        const { showId } = req.params;
        const userId = req.user?._id;
        if (!userId) {
            res.status(401).json({
                message: "User not authenticated",
            });
            return;
        }
        const thisShow = await show_1.default.findOne({ id: showId });
        if (!thisShow) {
            res.status(404).json({
                message: "Show not found",
            });
            return;
        }
        let userShow = await userShows_1.default.findOne({
            user: userId,
            show: thisShow._id,
        });
        if (userShow) {
            if (userShow.liked) {
                userShow.liked = false;
            }
            else {
                userShow.liked = true;
                userShow.disliked = false;
            }
            await userShow.save();
        }
        else {
            userShow = await userShows_1.default.create({
                user: userId,
                show: thisShow._id,
                liked: true,
                disliked: false,
            });
        }
        res.status(200).json({
            userShow,
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
};
exports.toggleLike = toggleLike;
const toggleDislike = async (req, res) => {
    try {
        const { showId } = req.params;
        const userId = req.user?._id;
        if (!userId) {
            res.status(401).json({
                message: "User not authenticated",
            });
            return;
        }
        const thisShow = await show_1.default.findOne({ id: showId });
        if (!thisShow) {
            res.status(404).json({
                message: "Show not found",
            });
            return;
        }
        let userShow = await userShows_1.default.findOne({
            user: userId,
            show: thisShow._id,
        });
        if (userShow) {
            if (userShow.disliked) {
                userShow.disliked = false;
            }
            else {
                userShow.disliked = true;
                userShow.liked = false;
            }
            await userShow.save();
        }
        else {
            userShow = await userShows_1.default.create({
                user: userId,
                show: thisShow._id,
                disliked: true,
                liked: false,
            });
        }
        res.status(200).json({
            userShow,
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
};
exports.toggleDislike = toggleDislike;
const toggleBookmark = async (req, res) => {
    try {
        const { showId } = req.params;
        const userId = req.user?._id;
        if (!userId) {
            res.status(401).json({
                message: "User not authenticated",
            });
            return;
        }
        const thisShow = await show_1.default.findOne({ id: showId });
        if (!thisShow) {
            res.status(404).json({
                message: "Show not found",
            });
            return;
        }
        let userShow = await userShows_1.default.findOne({
            user: userId,
            show: thisShow._id,
        });
        if (userShow) {
            if (userShow.bookmarked) {
                userShow.bookmarked = false;
            }
            else {
                userShow.bookmarked = true;
            }
            await userShow.save();
        }
        else {
            userShow = await userShows_1.default.create({
                user: userId,
                show: thisShow._id,
                bookmarked: true,
            });
        }
        res.status(200).json({
            userShow,
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
};
exports.toggleBookmark = toggleBookmark;
