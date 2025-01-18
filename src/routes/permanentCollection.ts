import express from "express";
import {
    getAllPermanentCollection,
    getPermanentCollectoinDetails,
} from "../controllers/permanentCollection";

const router = express.Router();

// @route GET /permanent-collection
// @desc Get all permanent collection groups
// @access Public
router.get("/", getAllPermanentCollection);

// @route GET /permanent-collection/:id
// @desc Get permanent collection details
// @access Public
router.get("/:id", getPermanentCollectoinDetails);

export default router;
