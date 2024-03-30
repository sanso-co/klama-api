import express from "express";
import {
  addCollectionToGroup,
  addShowToCollection,
  removeShowFromCollection,
  getAllCollections,
  getCollectoinDetails,
  addDetailsToCollection,
} from "../controllers/collection.js";

const router = express.Router();

// @route patch /collections
// @desc Add a new collection to the group
// @access Private
router.patch("/add/:id", addCollectionToGroup);

// @route patch /collections/add/:id
// @desc Add a show to collection
// @access Private
router.patch("/add-show/:id", addShowToCollection);

// @route patch /collections/add/:id
// @desc Add a show to collection
// @access Private
router.patch("/remove-show/:id", removeShowFromCollection);

// @route GET /collections/:id
// @desc Get collection details
// @access Private
router.get("/:id", getCollectoinDetails);

// not used below

// @route patch /collections/add/:id
// @desc Add a show to collection
// @access Private
router.patch("/edit/:id", addDetailsToCollection);

// @route GET /collections
// @desc Get all collections
// @access Private
router.get("/", getAllCollections);

export default router;
