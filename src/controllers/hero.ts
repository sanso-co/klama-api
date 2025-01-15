import { RequestHandler } from "express";
import Hero from "../models/hero";

export const getAllHero: RequestHandler = async (req, res) => {
    try {
        const heros = await Hero.find().sort({
            order: 1,
        });
        res.status(200).json(heros);
    } catch (error) {
        res.status(500).json(error);
    }
};
