"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const person_1 = require("../controllers/person");
const router = express_1.default.Router();
// @route patch /person/:personId
// @desc Get person details
// @access Private
router.get("/:personId", person_1.getPersonDetails);
exports.default = router;
