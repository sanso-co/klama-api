import express from "express";
import {
    addProvider,
    getAllProviders,
    getProvidersForShow,
    getProviderDetails,
    addShowToProvider,
    removeShowFromProvider,
    updateProvider,
    searchProvider,
} from "../controllers/provider.js";

const router = express.Router();

// @route POST /provider
// @desc Create a new provider
// @access Private
router.post("/", addProvider);

// @route GET /provider
// @desc Get all providers
// @access Private
router.get("/", getAllProviders);

// @route GET /provider/show/:id
// @desc Get providers that belong to a show
// @access Private
router.get("/show/:showId", getProvidersForShow);

// @route GET /provider/:id
// @desc Get provider details
// @access Private
router.get("/detail/:providerId", getProviderDetails);

// @route patch /provider/add/:id
// @desc Add a new show to provider
// @access Private
router.patch("/add/:id", addShowToProvider);

// @route patch /provider/remove/:id
// @desc Remove a show from provider
// @access Private
router.patch("/remove/:id", removeShowFromProvider);

// @route patch /provider/modify/:id
// @desc Update a provider
// @access Private
router.patch("/modify/:id", updateProvider);

// @route GET /provider/search
// @desc Search provider
// @access Private
router.get("/search", searchProvider);

export default router;
