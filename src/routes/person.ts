import express from "express";
import { getPersonDetails } from "../controllers/person";

const router = express.Router();

// @route patch /person/:personId
// @desc Get person details
// @access Private
router.get("/:personId", getPersonDetails);

export default router;
