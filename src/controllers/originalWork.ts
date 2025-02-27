import { RequestHandler } from "express";

import OriginalWork from "../models/originalWork";
import Show from "../models/show";
import Credit from "../models/credit";

export const getOriginalWorkForShow: RequestHandler = async (req, res) => {
    const { showId } = req.params;

    try {
        const show = await Show.findOne({ id: showId });

        if (!show) {
            res.status(404).json({ message: "Show not found" });
            return;
        }

        const originalWork = await OriginalWork.findById(show.original_work).populate({
            path: "author",
            select: "id name original_name job",
        });

        if (!originalWork) {
            res.status(200).json({
                hasOriginalWork: false,
                data: null,
            });
            return;
        }

        const response = {
            hasOriginalWork: true,
            _id: originalWork._id,
            title: originalWork.title,
            original_title: originalWork.original_title,
            type: originalWork.type,
            author: {
                _id: originalWork.author._id,
                id: originalWork.author.id,
                name: originalWork.author.name,
                original_name: originalWork.author.original_name,
                job: originalWork.author.job,
            },
        };

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const createOriginalWork: RequestHandler = async (req, res) => {
    const { title, original_title, authorId, type } = req.body;

    try {
        // Verify author exists and is an original author
        const author = await Credit.findById(authorId);

        if (!author) {
            res.status(404).json({ message: "Author not found" });
            return;
        }
        if (author.job !== "Original Author") {
            res.status(400).json({ message: "Credit must be an Original Author" });
            return;
        }

        // Create new original work
        const originalWork = new OriginalWork({
            title,
            original_title,
            author: authorId,
            type,
            shows: [], // Initialize with empty array
        });

        await originalWork.save();
        res.status(201).json(originalWork);
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const addShowToOriginalWork: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const { showId } = req.body;

    try {
        const originalWork = await OriginalWork.findById(id);
        if (!originalWork) {
            res.status(404).json({ message: "Original work not found" });
            return;
        }

        const show = await Show.findOne({ id: showId });
        if (!show) {
            res.status(404).json({ message: "Show not found" });
            return;
        }

        if (originalWork.shows.includes(show._id)) {
            res.status(400).json({ message: "Show already linked to this original work" });
            return;
        }

        // Add show to original work
        originalWork.shows.push(show._id);

        // Update show's original work reference
        show.original_work = originalWork._id;

        await Promise.all([originalWork.save(), show.save()]);

        res.status(200).json(originalWork);
    } catch (error) {
        res.status(500).json({ error });
    }
};
