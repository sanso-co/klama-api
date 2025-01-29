"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSimilar = void 0;
const similarityUtils_1 = require("../utilities/similarityUtils");
const getSimilar = async (req, res) => {
    const { showId } = req.params;
    try {
        const recommendations = await (0, similarityUtils_1.calculateSimilarity)(showId);
        res.status(200).json(recommendations);
    }
    catch (error) {
        res.status(500).json({ error });
    }
};
exports.getSimilar = getSimilar;
