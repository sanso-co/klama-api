"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const providerSchema = new mongoose_1.default.Schema({
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    logo_path: {
        type: String,
    },
    display_priority: {
        type: Number,
        default: 999,
    },
    shows: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Show",
        },
    ],
}, { timestamps: true });
exports.default = mongoose_1.default.model("Provider", providerSchema);
