"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const provider_1 = require("../controllers/provider");
const checkAuth_1 = require("../middleware/checkAuth");
const router = express_1.default.Router();
// @route GET /provider
// @desc Get all providers
// @access Public
router.get("/", provider_1.getAllProvider);
// @route GET /provider/show/:id
// @desc Get providers that belong to a show
// @access Public
router.get("/show/:showId", provider_1.getProvidersForShow);
// @route GET /provider/:id
// @desc Get provider details
// @access Public
router.get("/detail/:providerId", provider_1.getProviderDetails);
// @route GET /provider/search
// @desc Search provider
// @access Public
router.get("/search", provider_1.searchProvider);
// @route patch /provider/add/:id
// @desc Add a new show to provider
// @access Private
router.patch("/add/:id", checkAuth_1.checkAdmin, provider_1.addShowToProvider);
exports.default = router;
