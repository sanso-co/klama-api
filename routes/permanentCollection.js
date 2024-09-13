import express from "express";
import {
    createPermanentCollection,
    getAllPermanentCollections,
    getPermanentCollectoinDetails,
    addShowToPermanentCollection,
    removeShowFromPermanentCollection,
} from "../controllers/permanentCollection.js";

const router = express.Router();

// @route POST /permanent-collection
// @desc Create a new permanent collection
// @access Private
router.post("/", createPermanentCollection);

// @route GET /permanent-collection
// @desc Get all permanent collection groups
// @access Private
router.get("/", getAllPermanentCollections);

// @route GET /permanent-collection/:id
// @desc Get permanent collection details
// @access Private
router.get("/:id", getPermanentCollectoinDetails);

// @route patch /permanent-collection/add/:id
// @desc Add a new collection to the group
// @access Private
router.patch("/add/:id", addShowToPermanentCollection);

// @route patch /permanent-collection/remove/:id
// @desc Add a show to collection
// @access Private
router.patch("/remove/:id", removeShowFromPermanentCollection);

export default router;
