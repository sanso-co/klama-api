import { RequestHandler } from "express";
import KeywordLexicon from "../models/keywordLexicon";

export const getAllKeywordLexicon: RequestHandler = async (req, res) => {
    try {
        let keywordLexicons = await KeywordLexicon.find().sort({
            tag_id: 1,
        });
        res.status(200).json(keywordLexicons);
    } catch (error) {
        res.status(500).json(error);
    }
};

export const getKeywordLexiconByTagId: RequestHandler = async (req, res) => {
    const { tag_id } = req.params;
    console.log("one");
    try {
        const keywordLexicon = await KeywordLexicon.findOne({ tag_id });
        console.log("two", keywordLexicon);
        if (!keywordLexicon) {
            res.status(404).json({ message: "Keyword lexicon not found" });
            return;
        }
        res.status(200).json(keywordLexicon);
    } catch (error) {
        res.status(500).json(error);
    }
};

export const createKeywordLexicon: RequestHandler = async (req, res) => {
    const keywordLexicon = req.body;

    try {
        const existingLexicon = await KeywordLexicon.findOne({
            tag_id: keywordLexicon.tag_id,
        });

        if (existingLexicon) {
            res.status(400).json("Keyword lexicon already exists");
            return;
        }

        const newKeywordLexicon = await KeywordLexicon.create(keywordLexicon);

        res.status(200).json(newKeywordLexicon);
    } catch (error) {
        res.status(500).json(error);
    }
};

export const updateKeywordLexicon: RequestHandler = async (req, res) => {
    const { tag_id } = req.params;
    const updateData = req.body;

    try {
        const updatedLexicon = await KeywordLexicon.findOneAndUpdate(
            { tag_id },
            updateData,
            { new: true, upsert: true } // upsert: 없으면 생성
        );

        res.status(200).json(updatedLexicon);
    } catch (error) {
        res.status(500).json(error);
    }
};
