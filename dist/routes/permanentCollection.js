"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const permanentCollection_1 = require("../controllers/permanentCollection");
const router = express_1.default.Router();
// @route GET /permanent-collection
// @desc Get all permanent collection groups
// @access Public
router.get("/", permanentCollection_1.getAllPermanentCollection);
// @route GET /permanent-collection/:id
// @desc Get permanent collection details
// @access Public
router.get("/:id", permanentCollection_1.getPermanentCollectoinDetails);
exports.default = router;
