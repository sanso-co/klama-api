"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUserAccess = exports.checkAdmin = exports.verifyRefreshToken = exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const generateToken = (user, duration) => {
    if (!process.env.JWT_KEY) {
        throw new Error("JWT_KEY is not defined in environment variables");
    }
    return jsonwebtoken_1.default.sign({
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
    }, process.env.JWT_KEY, { expiresIn: duration || "1d" });
};
exports.generateToken = generateToken;
const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            res.status(401).json({ message: "No token provided" });
            return;
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_KEY);
            req.user = decoded;
            next();
        }
        catch (err) {
            if (err instanceof jsonwebtoken_1.default.TokenExpiredError) {
                res.status(401).json({ message: "Token expired" });
                return;
            }
            if (err instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                res.status(401).json({ message: "Invalid token" });
                return;
            }
            res.status(500).json({ message: "Internal server error" });
            return;
        }
    }
    catch (err) {
        res.status(500).json({ message: "Internal server error" });
        return;
    }
};
exports.verifyToken = verifyToken;
const verifyRefreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            res.status(401).json({ message: "No refresh token provided" });
            return;
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_KEY);
            const user = await user_1.default.findById(decoded._id);
            if (!user || user.refreshToken !== refreshToken) {
                res.status(401).json({ message: "Invalid refresh token" });
                return;
            }
            req.user = decoded;
            req.refreshToken = refreshToken;
            next();
        }
        catch (err) {
            if (err instanceof jsonwebtoken_1.default.TokenExpiredError) {
                res.status(401).json({ message: "Refresh token expired" });
                return;
            }
            if (err instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                res.status(401).json({ message: "Invalid refresh token" });
                return;
            }
            res.status(500).json({ message: "Internal server error" });
            return;
        }
    }
    catch (err) {
        res.status(500).json({ message: "Internal server error" });
        return;
    }
};
exports.verifyRefreshToken = verifyRefreshToken;
const checkAdmin = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            res.status(401).json({ message: "Authorization failed. No token provided" });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_KEY);
        if (!decoded.isAdmin) {
            res.status(403).json({ message: "Access denied. Admins only." });
            return;
        }
        req.user = decoded; // Attach decoded token to req.user
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Authentication failed." });
        return;
    }
};
exports.checkAdmin = checkAdmin;
const checkUserAccess = (req, res, next) => {
    const { id } = req.params;
    const requestingUser = req.user;
    if (id !== requestingUser._id && !requestingUser.isAdmin) {
        res.status(403).json({
            message: "Access denied. You can only view your own profile or must be an admin.",
        });
        return;
    }
    next();
};
exports.checkUserAccess = checkUserAccess;
