"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserDetails = void 0;
const user_1 = __importDefault(require("../models/user"));
const mongoose_1 = __importDefault(require("mongoose"));
const getUserDetails = async (req, res) => {
    const { id } = req.params;
    try {
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid user ID format" });
            return;
        }
        const details = await user_1.default.findById(id);
        if (!details) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json(details);
    }
    catch (error) {
        res.status(500).json(error);
    }
};
exports.getUserDetails = getUserDetails;
