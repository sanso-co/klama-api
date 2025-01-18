import { RequestHandler } from "express";
import Show from "../models/show";
import Credit from "../models/credit";
import { RequestQuery } from "../interfaces/api";

interface CreditParams {
    showId: string;
}

export const getAllCredit: RequestHandler = async (req, res) => {
    try {
        let credit = await Credit.find().sort({
            original_name: 1,
        });
        res.status(200).json(credit);
    } catch (error) {
        res.status(500).json(error);
    }
};

export const getCreditForShow: RequestHandler = async (req, res) => {
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

export const searchCredit: RequestHandler<{}, {}, {}, RequestQuery> = async (req, res) => {
    const { query, limit = "10" } = req.query;

    if (!query) {
        res.status(400).json({ message: "Search query is required" });
        return;
    }

    try {
        // Create a regex for case-insensitive partial matching
        const regexQuery = new RegExp(query, "i");

        const searchResults = await Credit.find({
            $or: [{ name: regexQuery }, { original_name: regexQuery }],
        })
            .limit(parseInt(limit))
            .select("_id id name original_name job rank")
            .lean();

        res.status(200).json(searchResults);
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const updateCredit: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    try {
        const updatedCredit = await Credit.findOneAndUpdate(
            { id },
            { $set: updatedData },
            { new: true }
        );

        if (!updatedCredit) {
            res.status(404).json("Credit not found");
            return;
        }

        res.status(200).json(updatedCredit);
    } catch (error) {
        res.status(500).json(error);
    }
};

export const addShowToCredit: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const { showId } = req.body;

    try {
        const credit = await Credit.findById(id);
        if (!credit) {
            res.status(404).json({ message: "Credit not found" });
            return;
        }
        const drama = await Show.findOne({ id: showId });

        if (!drama) {
            res.status(404).json({ message: "Show not found" });
            return;
        }

        if (credit.shows.includes(drama._id)) {
            res.status(400).json({ message: "Drama already exists in the credit" });
            return;
        }

        credit.shows.push(drama._id);

        await credit.save();
        res.status(200).json(credit);
    } catch (error) {
        res.status(500).json({ error });
    }
};
