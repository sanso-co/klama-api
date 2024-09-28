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

const router = express.Router();

// @route POST /credit
// @desc Create a new credit
// @access Private
router.post("/", createCredit);

// @route GET /genre
// @desc Get all genre
// @access Private
router.get("/", getAllCredits);

// @route GET /credit/show/:id
// @desc Get Credits that belong to a show
// @access Private
router.get("/show/:showId", getCreditForShow);

// @route GET /credit/detail/:id
// @desc Get Credit that belong to a show
// @access Private
router.get("/detail/:creditId", getCreditDetails);

// @route patch /credit/add/:id
// @desc Add a new show to credit
// @access Private
router.patch("/add/:id", addShowToCredit);

// @route PATCH /credit/modify/:id
// @desc Update a credit
// @access Private
router.patch("/modify/:id", updateCredit);

// @route GET /genre/search
// @desc Search drama
// @access Private
router.get("/search", searchKeyword);

export default router;
