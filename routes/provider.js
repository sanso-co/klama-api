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
import { checkAdmin } from "../middleware/checkAuth.js";

const router = express.Router();

// @route POST /provider
// @desc Create a new provider
// @access Private
router.post("/", checkAdmin, addProvider);

// @route GET /provider
// @desc Get all providers
// @access Public
router.get("/", getAllProviders);

// @route GET /provider/show/:id
// @desc Get providers that belong to a show
// @access Public
router.get("/show/:showId", getProvidersForShow);

// @route GET /provider/:id
// @desc Get provider details
// @access Public
router.get("/detail/:providerId", getProviderDetails);

// @route patch /provider/add/:id
// @desc Add a new show to provider
// @access Private
router.patch("/add/:id", checkAdmin, addShowToProvider);

// @route patch /provider/remove/:id
// @desc Remove a show from provider
// @access Private
router.patch("/remove/:id", checkAdmin, removeShowFromProvider);

// @route patch /provider/modify/:id
// @desc Update a provider
// @access Private
router.patch("/modify/:id", checkAdmin, updateProvider);

// @route GET /provider/search
// @desc Search provider
// @access Public
router.get("/search", searchProvider);

export default router;
