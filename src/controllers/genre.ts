import { RequestHandler } from "express";
import Genre from "../models/genre";

export const getAllGenre: RequestHandler = async (req, res) => {
    try {
        let genres = await Genre.find().sort({
            rank: 1,
        });
        res.status(200).json(genres);
    } catch (error) {
        res.status(500).json(error);
    }
};
