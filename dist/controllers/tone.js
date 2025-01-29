"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllTone = void 0;
const tone_1 = __importDefault(require("../models/tone"));
const getAllTone = async (req, res) => {
    try {
        let tone = await tone_1.default.find().sort({
            id: 1,
        });
        res.status(200).json(tone);
    }
    catch (error) {
        res.status(500).json(error);
    }
};
exports.getAllTone = getAllTone;
