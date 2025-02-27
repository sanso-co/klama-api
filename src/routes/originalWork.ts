import express from "express";
import {
    getOriginalWorkForShow,
    createOriginalWork,
    addShowToOriginalWork,
} from "../controllers/originalWork";
import { checkAdmin } from "../middleware/checkAuth";

const router = express.Router();

// @route GET api/original/show/:id
// @desc Get original work that belong to a show
// @access Public
router.get("/show/:showId", getOriginalWorkForShow);

// @route POST api/original
// @desc Create a new original work
// @access Private
router.post("/", checkAdmin, createOriginalWork);

// @route patch api/original/add/:id
// @desc Add a new show to original work
// @access Private
router.patch("/add/:id", checkAdmin, addShowToOriginalWork);

export default router;
