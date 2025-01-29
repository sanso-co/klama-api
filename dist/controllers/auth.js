"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeProfile = exports.googleAuth = exports.refresh = exports.login = exports.signup = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const axios_1 = __importDefault(require("axios"));
const checkAuth_1 = require("../middleware/checkAuth");
const user_1 = __importDefault(require("../models/user"));
const hashPassword = async (password) => {
    try {
        const passwordString = password.toString();
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedResult = await bcryptjs_1.default.hash(passwordString, salt);
        return hashedResult;
    }
    catch (error) {
        console.error("Error in hashPassword:", error);
        throw error;
    }
};
const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const [existingUsername, existingEmail] = await Promise.all([
            user_1.default.findOne({ username }),
            user_1.default.findOne({ email }),
        ]);
        if (existingUsername) {
            res.status(400).json({
                status: "error",
                message: "Username is already taken",
            });
            return;
        }
        if (existingEmail) {
            res.status(400).json({
                status: "error",
                message: "Email is already in use",
            });
            return;
        }
        const hashedPassword = await hashPassword(password).catch((err) => {
            console.error("Error caught in hashPassword:", err);
            throw err;
        });
        const newUser = await user_1.default.create({
            username,
            email,
            password: hashedPassword,
            isProfileComplete: true,
        });
        const accessToken = (0, checkAuth_1.generateToken)(newUser, "1d");
        const refreshToken = (0, checkAuth_1.generateToken)(newUser, "30d");
        newUser.refreshToken = refreshToken;
        await newUser.save();
        const { password: _, refreshToken: __, ...others } = newUser.toObject();
        res.status(200).json({
            ...others,
            accessToken,
            refreshToken,
        });
    }
    catch (error) {
        res.status(500).json({
            status: "error",
            message: error instanceof Error ? error.message : "An error occurred during signup",
        });
    }
};
exports.signup = signup;
const login = async (req, res) => {
    const { username, password: userPassword } = req.body;
    try {
        const user = await user_1.default.findOne({ username });
        if (!user) {
            res.status(400).json({ message: "User does not exist with this username" });
            return;
        }
        if (user.googleId) {
            res.status(400).json({
                message: "This account was created with Google. Please use Google sign-in.",
            });
            return;
        }
        const isPasswordValid = await bcryptjs_1.default.compare(userPassword.toString(), user.password);
        if (!isPasswordValid) {
            res.status(400).json({ message: "Invalid password" });
            return;
        }
        const accessToken = (0, checkAuth_1.generateToken)(user, "1d");
        const refreshToken = (0, checkAuth_1.generateToken)(user, "30d");
        user.refreshToken = refreshToken;
        await user.save();
        const { password, refreshToken: userRefreshToken, ...others } = user.toObject();
        res.status(200).json({
            ...others,
            accessToken,
            refreshToken,
        });
    }
    catch (error) {
        res.status(500).json({
            status: "error",
            message: error instanceof Error ? error.message : "An error occurred during login",
        });
    }
};
exports.login = login;
const refresh = async (req, res) => {
    try {
        const user = await user_1.default.findById(req.user?._id);
        if (!user) {
            res.status(401).json({ message: "User not found" });
            return;
        }
        const newAccessToken = (0, checkAuth_1.generateToken)(user, "1d");
        const newRefreshToken = (0, checkAuth_1.generateToken)(user, "30d");
        user.refreshToken = newRefreshToken;
        await user.save();
        res.json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        });
    }
    catch {
        res.status(401).json({ message: "Invalid refresh token" });
    }
};
exports.refresh = refresh;
const googleAuth = async (req, res) => {
    const { token } = req.body;
    try {
        const response = await axios_1.default.get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: `Bearer ${token}` },
        });
        const { sub: googleId, email, picture } = response.data;
        let user = await user_1.default.findOne({ email });
        if (!user) {
            user = await user_1.default.create({
                email,
                googleId,
                avatar: picture,
                isProfileComplete: false,
            });
        }
        else if (!user.googleId) {
            res.status(400).json({
                message: "This account was created without Google. Please use the regular login.",
            });
            return;
        }
        if (!user.isProfileComplete) {
            res.status(202).json({
                _id: user._id,
                email: user.email,
                avatar: user.avatar,
                requiresUsername: true,
                tempToken: (0, checkAuth_1.generateToken)(user, "1h"), // Short-lived token for completing profile
            });
            return;
        }
        const accessToken = (0, checkAuth_1.generateToken)(user, "1d");
        const refreshToken = (0, checkAuth_1.generateToken)(user, "30d");
        user.refreshToken = refreshToken;
        await user.save();
        const userObject = user.toObject();
        const { password, refreshToken: userRefreshToken, ...others } = userObject;
        res.status(200).json({
            ...others,
            accessToken,
            refreshToken,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                message: "Error during Google login. Please try again",
                error: error.message,
            });
        }
        else {
            res.status(500).json({
                message: "Error during Google login. Please try again",
                error: "An unknown error occurred",
            });
        }
    }
};
exports.googleAuth = googleAuth;
const completeProfile = async (req, res) => {
    try {
        const { username } = req.body;
        const userId = req.user?._id;
        const existingUsername = await user_1.default.findOne({ username });
        if (existingUsername) {
            res.status(400).json({ message: "Username already taken" });
            return;
        }
        const user = await user_1.default.findByIdAndUpdate(userId, {
            username: username,
            isProfileComplete: true,
        }, { new: true });
        if (!user) {
            res.status(400).json({ message: "Error updating username" });
            return;
        }
        const authToken = (0, checkAuth_1.generateToken)(user);
        res.status(200).json({
            user: {
                id: user._id,
                email: user.email,
                avatar: user.avatar,
                username: user.username,
            },
            token: authToken,
        });
    }
    catch (error) {
        res.status(500).json({
            status: "error",
            message: error instanceof Error
                ? error.message
                : "An error occurred during username creatiion",
        });
    }
};
exports.completeProfile = completeProfile;
