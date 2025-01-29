"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userShows = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    show: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Show",
        required: true,
    },
    watched: {
        type: Boolean,
        default: false,
    },
    liked: {
        type: Boolean,
        default: false,
    },
    disliked: {
        type: Boolean,
        default: false,
    },
    bookmarked: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
userShows.index({ user: 1, liked: 1 }); // Fast query for user's liked shows
userShows.index({ user: 1, watched: 1 }); // Fast query for user's watched shows
userShows.index({ user: 1, bookmarked: 1 }); // Fast query for user's watchlist
userShows.index({ show: 1, liked: 1 }); // Fast query for show's likes count
exports.default = mongoose_1.default.model("UserShows", userShows);
