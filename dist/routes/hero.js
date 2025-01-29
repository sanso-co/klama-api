"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const hero_1 = require("../controllers/hero");
const checkAuth_1 = require("../middleware/checkAuth");
const router = express_1.default.Router();
// @route GET /hero
// @desc Get all hero items
// @access Public
router.get("/", hero_1.getAllHero);
// @route POST /hero
// @desc Add a new hero
// @access Private
router.post("/", checkAuth_1.checkAdmin, hero_1.addHeroItem);
// @route PATCH /hero
// @desc Make changes to a hero item
// @access Private
router.patch("/:id", checkAuth_1.checkAdmin, hero_1.updateHeroItem);
exports.default = router;
