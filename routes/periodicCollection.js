import express from "express";
import {
    createPeriodicCollection,
    getAllPeriodicCollections,
    getPeriodicCollectoinDetails,
    addListToPeriodicCollection,
    getAListFromPeriodicCollection,
    addShowToSubPeriodicList,
} from "../controllers/periodicCollection.js";

const router = express.Router();

// PARENT

// @route GET /periodic-collection
// @desc Get all periodic collection groups
// @access Private
router.get("/", getAllPeriodicCollections);

// @route POST /periodic-collection
// @desc Create a new periodic collection group
// @access Private
router.post("/", createPeriodicCollection);

// COLLECTIONS

// @route GET /periodic-collection/:id
// @desc Get periodic collection details
// @access Private
router.get("/:id/all", getPeriodicCollectoinDetails);

// @route patch /periodic-collection/:id
// @desc Add a new list to the periodic collection
// @access Private
router.patch("/:id", addListToPeriodicCollection);

// SUB
// @route GET /periodic-collection/:id/sub
// @desc Get periodic collection details
// @access Private
router.get("/:collectionId/sub/:listId", getAListFromPeriodicCollection);

// @route patch /periodic-collection/add/:collectionId/:listId
// @desc Add a new show to the list
// @access Private
router.patch("/:collectionId/add/:listId", addShowToSubPeriodicList);

export default router;
