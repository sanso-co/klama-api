import express from "express";
import {
    createPeriodicCollection,
    getAllPeriodicCollections,
    getPeriodicCollectoinDetails,
    addListToPeriodicCollection,
    getAListFromPeriodicCollection,
    addShowToSubPeriodicList,
    removeShowFromSubPeriodicList,
} from "../controllers/periodicCollection.js";
import { checkAdmin } from "../middleware/checkAuth.js";

const router = express.Router();

// @route GET /periodic-collection
// @desc Get all periodic collections
// @access Public
router.get("/", getAllPeriodicCollections);

// @route POST /periodic-collection
// @desc Create a new periodic collection
// @access Private
router.post("/", checkAdmin, createPeriodicCollection);

// COLLECTIONS

// @route GET /periodic-collection/:id
// @desc Get periodic collection details
// @access Public
router.get("/:id/all", getPeriodicCollectoinDetails);

// @route patch /periodic-collection/:id
// @desc Add a new list to the periodic collection
// @access Private
router.patch("/:id", checkAdmin, addListToPeriodicCollection);

// SUB
// @route GET /periodic-collection/:id/sub
// @desc Get periodic collection details
// @access Public
router.get("/:collectionId/sub/:listId", getAListFromPeriodicCollection);

// @route patch /periodic-collection/add/:collectionId/:listId
// @desc Add a new show to the list
// @access Private
router.patch("/:collectionId/add/:listId", checkAdmin, addShowToSubPeriodicList);

// @route patch /periodic-collection/remove/:collectionId/:listId
// @desc Remove a show from the list
// @access Private
router.patch("/:collectionId/remove/:listId", checkAdmin, removeShowFromSubPeriodicList);

export default router;
