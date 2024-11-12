import express from "express";
import {
    createCredit,
    addShowToCredit,
    getAllCredits,
    getCreditForShow,
    searchKeyword,
    getCreditDetails,
    updateCredit,
} from "../controllers/credit.js";
import { checkAdmin } from "../middleware/checkAuth.js";

const router = express.Router();

// @route POST /credit
// @desc Create a new credit
// @access Private
router.post("/", checkAdmin, createCredit);

// @route GET /genre
// @desc Get all genre
// @access Public
router.get("/", getAllCredits);

// @route GET /credit/show/:id
// @desc Get Credits that belong to a show
// @access Public
router.get("/show/:showId", getCreditForShow);

// @route GET /credit/detail/:id
// @desc Get Credit that belong to a show
// @access Public
router.get("/detail/:creditId", getCreditDetails);

// @route patch /credit/add/:id
// @desc Add a new show to credit
// @access Private
router.patch("/add/:id", checkAdmin, addShowToCredit);

// @route PATCH /credit/modify/:id
// @desc Update a credit
// @access Private
router.patch("/modify/:id", checkAdmin, updateCredit);

// @route GET /genre/search
// @desc Search drama
// @access Public
router.get("/search", searchKeyword);

export default router;
