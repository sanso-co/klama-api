import { RequestHandler } from "express";
import { SortOrder, Types } from "mongoose";
import { spawn } from "child_process";
import path from "path";
import Show from "../models/show";
import Tone from "../models/tone";

import { paginatedResult } from "../utilities/paginateUtils";
import { ShowFindType } from "../interfaces/show";
import { PaginationResponseType, RequestQuery } from "../interfaces/api";
import { cleanText, feelingSlugMap } from "../helper/feeling";

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

// SEARCH TONE
export const searchTone: RequestHandler<{}, {}, {}, RequestQuery> = async (
    req,
    res
) => {
    const { query, limit = "10" } = req.query;

    if (!query) {
        res.status(400).json({ message: "Search query is required" });
        return;
    }

    try {
        // Create a regex for case-insensitive partial matching
        const regexQuery = new RegExp(query, "i");

        const searchResults = await Tone.find({
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

// CREATE A NEW TONE IN THE DASHBOARD
export const createTone: RequestHandler = async (req, res) => {
    const tone = req.body;

    try {
        const existingTone = await Tone.findOne({ id: tone.id });

        if (existingTone) {
            res.status(400).json("Tone already exists");
            return;
        }

        const newTone = await Tone.create(tone);

        res.status(200).json(newTone);
    } catch (error) {
        res.status(500).json(error);
    }
};

type PythonIntentResponse = {
    input: string;
    top_predictions: { intent: string; confidence: number }[];
};

const getToneIdByName = async (name: string) => {
    const toneDoc = await Tone.findOne({ name }).select("_id").lean();
    if (!toneDoc?._id) return null;

    return toneDoc._id as Types.ObjectId;
};

// SUBMIT USER EMOTION
export const submitUserEmotion: RequestHandler = async (req, res) => {
    const { feeling, question } = req.body;
    const {
        page = "1",
        limit = "30",
        sort = "name_asc",
    } = req.query as {
        page?: string;
        limit?: string;
        sort?: "name_asc" | "date_desc" | string;
    };

    let responded = false;
    const sendOnce = (status: number, body: any) => {
        if (responded) return;
        responded = true;
        res.status(status).json(body);
    };
    try {
        if (!feeling || !question) {
            return sendOnce(400, { error: "Missing 'feeling' or 'question'" });
        }

        const normalizedFeeling = String(feeling).toLowerCase().trim();
        const humanFeeling = feelingSlugMap[normalizedFeeling] || "Unknown";
        const cleanedQuestion = cleanText(String(question));

        const scriptPath = path.resolve("src/ml/predict_intent.py");
        const pyProcess = spawn(
            "/opt/anaconda3/bin/python",
            [scriptPath, humanFeeling, cleanedQuestion],
            { env: { ...process.env, PYTHONUNBUFFERED: "1" } }
        );

        let resultData = "";
        pyProcess.stdout.on("data", (data) => {
            resultData += data.toString();
        });
        pyProcess.stderr.on("data", (data) => {
            console.error("Python stderr:", data.toString());
        });
        pyProcess.on("error", (err) => {
            return sendOnce(500, {
                error: "Failed to start Python process",
                details: String(err),
            });
        });

        pyProcess.on("close", async (code) => {
            if (responded) return; // extra safety
            if (code !== 0) {
                return sendOnce(500, { error: "Python script failed" });
            }

            let parsed: PythonIntentResponse | null = null;
            try {
                parsed = JSON.parse(resultData);
            } catch (err) {
                return sendOnce(500, {
                    error: "Invalid JSON from Python",
                    details: resultData,
                });
            }

            if (!parsed?.top_predictions?.length) {
                return sendOnce(200, {
                    intent: null,
                    confidence: null,
                    items: [],
                    pagination: {
                        page: Number(page),
                        limit: Number(limit),
                        total: 0,
                        totalPages: 0,
                    },
                });
            }

            const { intent: topIntent, confidence } = parsed.top_predictions[0];

            const toneId = await getToneIdByName(topIntent);
            if (!toneId) {
                return sendOnce(200, {
                    intent: topIntent,
                    confidence,
                    input: parsed.input,
                    items: [],
                    pagination: {
                        page: Number(page),
                        limit: Number(limit),
                        total: 0,
                        totalPages: 0,
                    },
                });
            }

            const pageNum = Math.max(1, parseInt(String(page), 10) || 1);
            const limitNum = Math.min(
                100,
                Math.max(1, parseInt(String(limit), 10) || 30)
            );
            const sortOption: Record<string, SortOrder> =
                sort === "date_desc"
                    ? { first_air_date: -1 as SortOrder }
                    : { original_name: 1 as SortOrder };

            const query = { tones: toneId };

            try {
                const [total, items] = await Promise.all([
                    Show.countDocuments(query),
                    Show.find(query)
                        .select(
                            "id name original_name poster_path first_air_date popularity_score"
                        )
                        .sort(sortOption)
                        .skip((pageNum - 1) * limitNum)
                        .limit(limitNum)
                        .lean(),
                ]);

                return sendOnce(200, {
                    intent: topIntent,
                    confidence,
                    input: parsed.input,
                    items,
                    pagination: {
                        page: pageNum,
                        limit: limitNum,
                        total,
                        totalPages: Math.ceil(total / limitNum),
                    },
                });
            } catch (dbErr) {
                return sendOnce(500, {
                    error: "DB query failed",
                    details: String(dbErr),
                });
            }
        });
    } catch (error: any) {
        if (!res.headersSent) {
            return res.status(500).json({ error: String(error) });
        }
    }
    // try {
    //     if (!feeling || !question) {
    //         res.status(400).json({ error: "Missing 'feeling' or 'question'" });
    //         return;
    //     }

    //     const normalizedFeeling = String(feeling).toLowerCase().trim();
    //     const humanFeeling = feelingSlugMap[normalizedFeeling] || "Unknown";
    //     const cleanedQuestion = cleanText(String(question));

    //     const scriptPath = path.resolve("src/ml/predict_intent.py");
    //     const pyProcess = spawn(
    //         "/opt/anaconda3/bin/python",
    //         [scriptPath, humanFeeling, cleanedQuestion],
    //         {
    //             env: { ...process.env, PYTHONUNBUFFERED: "1" },
    //         }
    //     );

    //     let resultData = "";
    //     pyProcess.stdout.on("data", (data) => {
    //         resultData += data.toString();
    //     });
    //     pyProcess.stderr.on("data", (data) => {
    //         console.error("Python stderr:", data.toString());
    //     });

    //     pyProcess.on("close", async (code) => {
    //         if (code !== 0) {
    //             return res.status(500).json({ error: "Python script failed" });
    //         }

    //         let parsed: PythonIntentResponse | null = null;
    //         try {
    //             parsed = JSON.parse(resultData);
    //         } catch (err) {
    //             res.status(500).json({ error: "Invalid JSON from Python", details: resultData });
    //         }

    //         if (!parsed?.top_predictions?.length) {
    //             res.status(200).json({
    //                 intent: null,
    //                 confidence: null,
    //                 items: [],
    //                 pagination: {
    //                     page: Number(page),
    //                     limit: Number(limit),
    //                     total: 0,
    //                     totalPages: 0,
    //                 },
    //             });
    //             return;
    //         }

    //         const { intent: topIntent, confidence } = parsed.top_predictions[0];

    //         const toneId = await getToneIdByName(topIntent);
    //         if (!toneId) {
    //             res.status(200).json({
    //                 intent: topIntent,
    //                 confidence,
    //                 input: parsed.input,
    //                 items: [],
    //                 pagination: {
    //                     page: Number(page),
    //                     limit: Number(limit),
    //                     total: 0,
    //                     totalPages: 0,
    //                 },
    //             });
    //         }

    //         const pageNum = Math.max(1, parseInt(String(page), 10) || 1);
    //         const limitNum = Math.min(100, Math.max(1, parseInt(String(limit), 10) || 30));

    //         const sortOption: Record<string, SortOrder> =
    //             sort === "date_desc"
    //                 ? { first_air_date: -1 as SortOrder }
    //                 : { original_name: 1 as SortOrder };

    //         const query = { tones: toneId };
    //         try {
    //             const [total, items] = await Promise.all([
    //                 Show.countDocuments(query),
    //                 Show.find(query)
    //                     .select("id name original_name poster_path first_air_date popularity_score")
    //                     .sort(sortOption)
    //                     .skip((pageNum - 1) * limitNum)
    //                     .limit(limitNum)
    //                     .lean(),
    //             ]);

    //             res.status(200).json({
    //                 intent: topIntent,
    //                 confidence,
    //                 input: parsed.input,
    //                 items,
    //                 pagination: {
    //                     page: pageNum,
    //                     limit: limitNum,
    //                     total,
    //                     totalPages: Math.ceil(total / limitNum),
    //                 },
    //             });
    //         } catch (dbErr) {
    //             res.status(500).json({ error: "DB query failed", details: String(dbErr) });
    //         }
    //     });
    // } catch (error) {
    //     res.status(500).json(error);
    // }
};
