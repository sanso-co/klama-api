import express from "express";
import {
    getAllProvider,
    getProvidersForShow,
    getProviderDetails,
    searchProvider,
    addShowToProvider,
} from "../controllers/provider";
import { checkAdmin } from "../middleware/checkAuth";

const router = express.Router();

// @route GET /provider
// @desc Get all providers
// @access Public
router.get("/", getAllProvider);

// @route GET /provider/show/:id
// @desc Get providers that belong to a show
// @access Public
router.get("/show/:showId", getProvidersForShow);

// @route GET /provider/:id
// @desc Get provider details
// @access Public
router.get("/detail/:providerId", getProviderDetails);

// @route GET /provider/search
// @desc Search provider
// @access Public
router.get("/search", searchProvider);

// @route patch /provider/add/:id
// @desc Add a new show to provider
// @access Private
router.patch("/add/:id", checkAdmin, addShowToProvider);

export default router;
