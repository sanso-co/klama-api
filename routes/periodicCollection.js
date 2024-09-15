import express from "express";
import {
    createPeriodicCollection,
    getAllPeriodicCollections,
    getPeriodicCollectoinDetails,
    getPeriodicDetailsLatest,
    addListToPeriodicCollection,
} from "../controllers/periodicCollection.js";

const router = express.Router();

// @route POST /periodic-collection
// @desc Create a new periodic collection group
// @access Private
router.post("/", createPeriodicCollection);

// @route GET /periodic-collection
// @desc Get all periodic collection groups
// @access Private
router.get("/", getAllPeriodicCollections);

// @route GET /periodic-collection/:id
// @desc Get periodic collection details
// @access Private
router.get("/:id/all", getPeriodicCollectoinDetails);

// @route GET /periodic-collection/:id
// @desc Get periodic collection details
// @access Private
router.get("/:id/latest", getPeriodicDetailsLatest);

// @route patch /periodic-collection/:id
// @desc Add a new collection to the group
// @access Private
router.patch("/:id", addListToPeriodicCollection);

export default router;
