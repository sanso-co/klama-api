import express from "express";
import {
    createProviderCollection,
    getAllProviderCollections,
    getProviderCollectoinDetails,
    addShowToProviderCollection,
    removeShowFromProviderCollection,
} from "../controllers/providerCollection.js";

const router = express.Router();

// @route POST /provider-collection
// @desc Create a new provider collection
// @access Private
router.post("/", createProviderCollection);

// @route GET /provider-collection
// @desc Get all provider collection groups
// @access Private
router.get("/", getAllProviderCollections);

// @route GET /provider-collection/:id
// @desc Get provider collection details
// @access Private
router.get("/:id", getProviderCollectoinDetails);

// @route patch /provider-collection/add/:id
// @desc Add a new collection to the group
// @access Private
router.patch("/add/:id", addShowToProviderCollection);

// @route patch /provider-collection/remove/:id
// @desc Add a show to collection
// @access Private
router.patch("/remove/:id", removeShowFromProviderCollection);

export default router;
