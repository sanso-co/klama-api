"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../controllers/user");
const checkAuth_1 = require("../middleware/checkAuth");
const router = express_1.default.Router();
// @route GET /user/details/:id
// @desc Get user details
// @access Public
router.get("/:id", checkAuth_1.verifyToken, checkAuth_1.checkUserAccess, user_1.getUserDetails);
exports.default = router;
