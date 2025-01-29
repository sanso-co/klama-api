"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../controllers/auth");
const checkAuth_1 = require("../middleware/checkAuth");
const router = express_1.default.Router();
// @route post /signup
// @desc Create a new user
// @access Public
router.post("/signup", auth_1.signup);
// @route post /login
// @desc Login
// @access Public
router.post("/login", auth_1.login);
// @route post /refresh
// @desc Refresh
// @access Private
router.post("/refresh", auth_1.refresh);
// @route post /google
// @desc Google
// @access Public
router.post("/google", auth_1.googleAuth);
// @route post /complete-profile
// @desc create username after google signup
// @access Private
router.post("/complete-profile", checkAuth_1.verifyToken, auth_1.completeProfile);
exports.default = router;
