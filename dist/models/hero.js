"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const heroSchema = new mongoose_1.default.Schema({
    order: {
        type: Number,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
    },
    tag: {
        label: {
            type: String,
        },
        color: {
            type: String,
        },
    },
    url: {
        type: String,
    },
    img: {
        type: String,
    },
    tagline: {
        type: String,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Hero", heroSchema);
