import { RequestHandler } from "express";
import { calculateSimilarity } from "../utilities/similarityUtils";

interface ShowParams {
    showId: string;
}

export const getSimilar: RequestHandler<ShowParams, {}, {}, {}> = async (req, res) => {
    const { showId } = req.params;

    try {
        const recommendations = await calculateSimilarity(showId);
        res.status(200).json(recommendations);
    } catch (error) {
        res.status(500).json({ error });
    }
};
