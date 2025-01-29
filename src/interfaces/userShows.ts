import mongoose, { Document } from "mongoose";

export interface IUserShows extends Document {
    user: mongoose.Types.ObjectId;
    show: mongoose.Types.ObjectId;
    watched: boolean;
    liked: boolean;
    disliked: boolean;
    bookmarked: boolean;
}
