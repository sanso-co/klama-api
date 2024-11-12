import express from "express";
import {
    createPermanentCollection,
    getAllPermanentCollections,
    getPermanentCollectoinDetails,
    addShowToPermanentCollection,
    removeShowFromPermanentCollection,
} from "../controllers/permanentCollection.js";
import { checkAdmin } from "../middleware/checkAuth.js";

const router = express.Router();

// @route POST /permanent-collection
// @desc Create a new permanent collection
// @access Private
router.post("/", checkAdmin, createPermanentCollection);

// @route GET /permanent-collection
// @desc Get all permanent collection groups
// @access Public
router.get("/", getAllPermanentCollections);

// @route GET /permanent-collection/:id
// @desc Get permanent collection details
// @access Public
router.get("/:id", getPermanentCollectoinDetails);

// @route patch /permanent-collection/add/:id
// @desc Add a new collection to the group
// @access Private
router.patch("/add/:id", checkAdmin, addShowToPermanentCollection);

// @route patch /permanent-collection/remove/:id
// @desc Add a show to collection
// @access Private
router.patch("/remove/:id", checkAdmin, removeShowFromPermanentCollection);

export default router;
