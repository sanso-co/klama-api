import express from "express";
import {
    getCreditForShow,
    getAllCredit,
    searchCredit,
    updateCredit,
    addShowToCredit,
} from "../controllers/credit";
import { checkAdmin } from "../middleware/checkAuth";

const router = express.Router();

// @route GET /credit
// @desc Get all credit
// @access Public
router.get("/", getAllCredit);

// @route GET /credit/show/:id
// @desc Get Credits that belong to a show
// @access Public
router.get("/show/:showId", getCreditForShow);

// @route GET /credit/search
// @desc Search credit
// @access Public
router.get("/search", searchCredit);

// @route PATCH /credit/modify/:id
// @desc Update a credit
// @access Private
router.patch("/modify/:id", checkAdmin, updateCredit);

// @route patch /credit/add/:id
// @desc Add a new show to credit
// @access Private
router.patch("/add/:id", checkAdmin, addShowToCredit);

export default router;
