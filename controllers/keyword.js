import Keyword from "../models/keyword.js";

export const createKeyword = async (req, res) => {
    const keyword = req.body;

    try {
        const existingKeyword = await Keyword.findOne({ id: keyword.id });

        if (existingKeyword) {
            return res.status(400).json("Keyword already exists");
        }

        const newKeyword = await Keyword.create(keyword);

        res.status(200).json(newKeyword);
    } catch (error) {}
};

// get all keywords
export const getAllKeywords = async (req, res) => {
    try {
        let keywords = await Keyword.find().sort({
            rank: 1,
        });
        res.status(200).json(keywords);
    } catch (error) {
        res.status(500).json(error);
    }
};

//update keyword
export const updateKeyword = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    try {
        const updatedKeyword = await Keyword.findOneAndUpdate(
            { id },
            { $set: updatedData },
            { new: true }
        );

        if (!updatedKeyword) {
            return res.status(404).json("Keyword not found");
        }

        res.status(200).json(updatedKeyword);
    } catch (error) {
        res.status(500).json(error);
    }
};
