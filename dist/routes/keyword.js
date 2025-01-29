"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const keyword_1 = require("../controllers/keyword");
const router = express_1.default.Router();
// @route GET /keyword
// @desc Get all keywords
// @access Public
router.get("/", keyword_1.getAllKeyword);
// @route GET /keyword/search
// @desc Search keyword
// @access Public
router.get("/search", keyword_1.searchKeyword);
exports.default = router;
