"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const showType_1 = require("../controllers/showType");
const router = express_1.default.Router();
// @route GET /
// @desc Get all show types
// @access Public
router.get("/", showType_1.getAllShowType);
exports.default = router;
