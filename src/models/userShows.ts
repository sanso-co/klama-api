import mongoose from "mongoose";

import { IUserShows } from "../interfaces/userShows";

const userShows = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        show: {
            type: mongoose.Schema.Types.ObjectId,
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
        wishlisted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

userShows.index({ user: 1, liked: 1 }); // Fast query for user's liked shows
userShows.index({ user: 1, watched: 1 }); // Fast query for user's watched shows
userShows.index({ user: 1, wishlisted: 1 }); // Fast query for user's watchlist
userShows.index({ show: 1, liked: 1 }); // Fast query for show's likes count

export default mongoose.model<IUserShows>("UserShows", userShows);
