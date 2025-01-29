"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tone_1 = require("../controllers/tone");
const router = express_1.default.Router();
// @route GET /tone
// @desc Get all tone
// @access Public
router.get("/", tone_1.getAllTone);
exports.default = router;
