import express from "express";
import { createCollectionGroup, getAllCollections, getCollectoinDetails } from "../controllers/collectionGroup.js";

const router = express.Router();

// @route POST /collection-group
// @desc Create a new collection group
// @access Private
router.post("/", createCollectionGroup);

// @route GET /collection-group
// @desc Get all collection groups
// @access Private
router.get("/", getAllCollections);

// @route GET /collection-group/:id
// @desc Get collection group details
// @access Private
router.get("/:id", getCollectoinDetails);

export default router;
