import express from "express";
import { getPermanentCollectoinDetails } from "../controllers/permanentCollection";

const router = express.Router();

// @route GET /permanent-collection/:id
// @desc Get permanent collection details
// @access Public
router.get("/:id", getPermanentCollectoinDetails);

export default router;
