import { RequestHandler } from "express";
import Keyword from "../models/keyword";
import { RequestQuery } from "../interfaces/api";

export const getAllKeyword: RequestHandler = async (req, res) => {
    try {
        let keywords = await Keyword.find().sort({
            id: 1,
        });
        res.status(200).json(keywords);
    } catch (error) {
        res.status(500).json(error);
    }
};

export const searchKeyword: RequestHandler<{}, {}, {}, RequestQuery> = async (req, res) => {
    const { query, limit = "10" } = req.query;

    if (!query) {
        res.status(400).json({ message: "Search query is required" });
        return;
    }

    try {
        // Create a regex for case-insensitive partial matching
        const regexQuery = new RegExp(query, "i");

        const searchResults = await Keyword.find({
            $or: [{ name: regexQuery }, { original_name: regexQuery }],
        })
            .limit(parseInt(limit))
            .select("_id id name original_name rank")
            .lean();

        res.status(200).json(searchResults);
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const createKeyword: RequestHandler = async (req, res) => {
    const keyword = req.body;

    try {
        const existingKeyword = await Keyword.findOne({ id: keyword.id });

        if (existingKeyword) {
            res.status(400).json("Keyword already exists");
            return;
        }

        const newKeyword = await Keyword.create(keyword);

        res.status(200).json(newKeyword);
    } catch (error) {}
};

export const updateKeyword: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const updatedData: {
        id?: string;
        rank?: string;
        name?: string;
        original_name?: string;
    } = req.body;

    try {
        const updatedKeyword = await Keyword.findOneAndUpdate(
            { id: id },
            { $set: updatedData },
            { new: true, runValidators: true }
        );

        if (!updatedKeyword) {
            res.status(404).json({ message: "Keyword not found" });
            return;
        }
        res.status(200).json(updatedKeyword);
    } catch (error) {}
};
