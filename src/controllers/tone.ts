import { RequestHandler } from "express";
import Tone from "../models/tone";

export const getAllTone: RequestHandler = async (req, res) => {
    try {
        let tone = await Tone.find().sort({
            id: 1,
        });
        res.status(200).json(tone);
    } catch (error) {
        res.status(500).json(error);
    }
};
