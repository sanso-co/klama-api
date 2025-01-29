"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const permanentCollection = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
    },
    shows: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Show",
        },
    ],
}, { timestamps: true });
exports.default = mongoose_1.default.model("PermanentCollection", permanentCollection);
