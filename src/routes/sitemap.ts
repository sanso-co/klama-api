import express from "express";
import { generateSitemap } from "../controllers/sitemap";

const router = express.Router();

// @route GET /sitemap
// @desc Generate Sitemap
// @access Public
router.get("/sitemap.xml", generateSitemap);

export default router;
