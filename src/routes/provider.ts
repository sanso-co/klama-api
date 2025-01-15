import express from "express";
import { getProvidersForShow, getProviderDetails } from "../controllers/provider";

const router = express.Router();

// @route GET /provider/show/:id
// @desc Get providers that belong to a show
// @access Public
router.get("/show/:showId", getProvidersForShow);

// @route GET /provider/:id
// @desc Get provider details
// @access Public
router.get("/detail/:providerId", getProviderDetails);

export default router;
