"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const creditSchema = new mongoose_1.default.Schema({
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    original_name: {
        type: String,
    },
    job: {
        type: String,
    },
    shows: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Show",
        },
    ],
}, { timestamps: true });
exports.default = mongoose_1.default.model("Credit", creditSchema);
