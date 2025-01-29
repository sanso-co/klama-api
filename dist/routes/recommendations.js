"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const recommendations_1 = require("../controllers/recommendations");
const router = express_1.default.Router();
// @route GET /recommendations/similar/:id
// @desc Get similar recommendations
// @access Private
router.get("/similar/:showId", recommendations_1.getSimilar);
exports.default = router;
