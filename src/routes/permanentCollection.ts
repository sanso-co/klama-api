import express from "express";
import {
    getAllPermanentCollection,
    getPermanentCollectoinDetails,
    createPermanentCollection,
    addShowToPermanentCollection,
} from "../controllers/permanentCollection";
import { checkAdmin } from "../middleware/checkAuth";

const router = express.Router();

// @route GET /permanent-collection
// @desc Get all permanent collection groups
// @access Public
router.get("/", getAllPermanentCollection);

// @route GET /permanent-collection/:id
// @desc Get permanent collection details
// @access Public
router.get("/:id", getPermanentCollectoinDetails);

// @route POST /permanent-collection
// @desc Create a new permanent collection
// @access Private
router.post("/", checkAdmin, createPermanentCollection);

// @route patch /permanent-collection/add/:id
// @desc Add a new collection to the group
// @access Private
router.patch("/add/:id", checkAdmin, addShowToPermanentCollection);

export default router;
