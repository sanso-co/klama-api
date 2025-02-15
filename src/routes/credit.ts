import express from "express";
import {
    getCreditForShow,
    getCreditDetails,
    getAllCredit,
    searchCredit,
    updateCredit,
    addShowToCredit,
    createCredit,
} from "../controllers/credit";
import { checkAdmin } from "../middleware/checkAuth";

const router = express.Router();

// @route GET /credit
// @desc Get all credit
// @access Public
router.get("/", getAllCredit);

// @route GET api/credit/show/:id
// @desc Get Credits that belong to a show
// @access Public
router.get("/show/:showId", getCreditForShow);

// @route GET api/credit/detail/:id
// @desc Get Credit that belong to a show
// @access Public
router.get("/detail/:creditId", getCreditDetails);

// @route GET api/credit/search
// @desc Search credit
// @access Public
router.get("/search", searchCredit);

// @route PATCH api/credit/modify/:id
// @desc Update a credit
// @access Private
router.patch("/modify/:id", checkAdmin, updateCredit);

// @route patch api/credit/add/:id
// @desc Add a new show to credit
// @access Private
router.patch("/add/:id", checkAdmin, addShowToCredit);

// @route POST api/credit
// @desc Create a new credit
// @access Private
router.post("/", checkAdmin, createCredit);

export default router;
