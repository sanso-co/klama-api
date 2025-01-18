import express from "express";
import {
    getAllCollection,
    getCollection,
    getListFromCollection,
    addListToCollection,
} from "../controllers/periodicCollection";
import { checkAdmin } from "../middleware/checkAuth";

const router = express.Router();

// @route GET /periodic-collection
// @desc Get all periodic collections
// @access Public
router.get("/", getAllCollection);

// @route GET /periodic-collection/:id
// @desc Get periodic collection details
// @access Public
router.get("/:collectionId/all", getCollection);

// @route GET /periodic-collection/:id/sub/:listId
// @desc Get periodic collection details
// @access Public
router.get("/:collectionId/sub/:listId", getListFromCollection);

// @route patch /periodic-collection/:id
// @desc Add a new list to the periodic collection
// @access Private
router.patch("/:id", checkAdmin, addListToCollection);

export default router;
