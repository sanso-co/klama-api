"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cast_1 = require("../controllers/cast");
const checkAuth_1 = require("../middleware/checkAuth");
const router = express_1.default.Router();
// @route patch /cast/:showId
// @desc Add a new show to credit
// @access Public
router.get("/:showId", cast_1.getCastsForShow);
// @route patch /cast/update/:showId
// @desc Add a new show to credit
// @access Private
router.patch("/update/:showId", checkAuth_1.checkAdmin, cast_1.updateShowCast);
exports.default = router;
