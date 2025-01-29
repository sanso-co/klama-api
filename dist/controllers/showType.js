"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllShowType = void 0;
const showType_1 = __importDefault(require("../models/showType"));
const getAllShowType = async (req, res) => {
    try {
        let types = await showType_1.default.find().sort({
            id: 1,
        });
        res.status(200).json(types);
    }
    catch (error) {
        res.status(500).json(error);
    }
};
exports.getAllShowType = getAllShowType;
