import { RequestHandler } from "express";
import Show from "../models/show";
import Credit from "../models/credit";

interface CreditParams {
    showId: string;
}

export const getCreditForShow: RequestHandler<CreditParams, {}, {}, {}> = async (req, res) => {
    const { showId } = req.params;

    try {
        const show = await Show.findOne({ id: showId });

        if (!show) {
            res.status(404).json({ message: "Drama not found" });
            return;
        }

        const credits = await Credit.find({ shows: show._id }).sort({ job: 1 });

        const response = {
            id: showId,
            results: credits.map((credit) => ({
                _id: credit._id,
                id: credit.id,
                name: credit.name,
                original_name: credit.original_name,
                job: credit.job,
            })),
        };

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error });
    }
};
