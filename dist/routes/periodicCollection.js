"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const periodicCollection_1 = require("../controllers/periodicCollection");
const checkAuth_1 = require("../middleware/checkAuth");
const router = express_1.default.Router();
// @route GET /periodic-collection
// @desc Get all periodic collections
// @access Public
router.get("/", periodicCollection_1.getAllCollection);
// @route GET /periodic-collection/:id
// @desc Get periodic collection details
// @access Public
router.get("/:collectionId/all", periodicCollection_1.getCollection);
// @route GET /periodic-collection/:id/sub/:listId
// @desc Get periodic collection details
// @access Public
router.get("/:collectionId/sub/:listId", periodicCollection_1.getListFromCollection);
// @route patch /periodic-collection/:id
// @desc Add a new list to the periodic collection
// @access Private
router.patch("/:id", checkAuth_1.checkAdmin, periodicCollection_1.addListToCollection);
exports.default = router;
