"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const credit_1 = require("../controllers/credit");
const checkAuth_1 = require("../middleware/checkAuth");
const router = express_1.default.Router();
// @route GET /credit
// @desc Get all credit
// @access Public
router.get("/", credit_1.getAllCredit);
// @route GET /credit/show/:id
// @desc Get Credits that belong to a show
// @access Public
router.get("/show/:showId", credit_1.getCreditForShow);
// @route GET /credit/detail/:id
// @desc Get Credit that belong to a show
// @access Public
router.get("/detail/:creditId", credit_1.getCreditDetails);
// @route GET /credit/search
// @desc Search credit
// @access Public
router.get("/search", credit_1.searchCredit);
// @route PATCH /credit/modify/:id
// @desc Update a credit
// @access Private
router.patch("/modify/:id", checkAuth_1.checkAdmin, credit_1.updateCredit);
// @route patch /credit/add/:id
// @desc Add a new show to credit
// @access Private
router.patch("/add/:id", checkAuth_1.checkAdmin, credit_1.addShowToCredit);
exports.default = router;
