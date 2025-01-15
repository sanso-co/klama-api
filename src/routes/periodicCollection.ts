import express from "express";
import { getListFromCollection } from "../controllers/periodicCollection";

const router = express.Router();

// @route GET /periodic-collection/:id/sub/:listId
// @desc Get periodic collection details
// @access Public
router.get("/:collectionId/sub/:listId", getListFromCollection);

export default router;
