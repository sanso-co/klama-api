"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const castSchema = new mongoose_1.default.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    casts: [
        {
            person: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "Person",
                required: true,
            },
            role: {
                type: String,
            },
            original_role: {
                type: String,
                default: "",
            },
            order: {
                type: Number,
            },
        },
    ],
}, { timestamps: true });
exports.default = mongoose_1.default.model("Cast", castSchema);
