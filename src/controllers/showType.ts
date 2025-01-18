import { RequestHandler } from "express";
import ShowType from "../models/showType";

export const getAllShowType: RequestHandler = async (req, res) => {
    try {
        let types = await ShowType.find().sort({
            id: 1,
        });
        res.status(200).json(types);
    } catch (error) {
        res.status(500).json(error);
    }
};
