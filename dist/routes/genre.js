"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const genre_1 = require("../controllers/genre");
const router = express_1.default.Router();
// @route GET /genre
// @desc Get all genre
// @access Public
router.get("/", genre_1.getAllGenre);
// @route GET /genre/search
// @desc Search genre
// @access Public
router.get("/search", genre_1.searchGenre);
exports.default = router;
