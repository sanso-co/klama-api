import bcrypt from "bcryptjs";
import axios from "axios";

import User from "../models/user.js";
import { generateToken } from "../middleware/checkAuth.js";

const hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedResult = await bcrypt.hash(password, salt);
        return hashedResult;
    } catch (error) {
        console.error("Error in hashPassword:", error);
        throw error;
    }
};

export const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const [existingEmail, existingUsername] = await Promise.all([
            User.findOne({ email }),
            User.findOne({ username }),
        ]);

        let errorMessage = "";

        if (existingUsername) {
            errorMessage = "Username is already taken";
        }

        if (existingEmail) {
            errorMessage = "Email is already in use";
        }

        if (errorMessage) {
            return res.status(400).json({
                status: "error",
                message: errorMessage,
            });
        }

        const hashedPassword = await hashPassword(password).catch((err) => {
            console.error("Error caught in hashPassword:", err);
            throw err;
        });

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            isProfileComplete: true,
        });

        const token = generateToken(newUser);

        const { password: _, ...others } = newUser._doc;

        res.status(200).json({ ...others, token });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message || "An error occurred during signup",
        });
    }
};

//login
export const login = async (req, res) => {
    const { username, password } = req.body;

    console.log(username, password);
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "User does not exist with this username" });
        }

        if (user.googleId) {
            return res.status(400).json({
                message: "This account was created with Google. Please use Google sign-in.",
            });
        }

        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const token = generateToken(user);
        const { password, ...others } = user._doc;
        res.status(200).json({ ...others, token });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message || "An error occurred during login",
        });
    }
};

export const googleAuth = async (req, res) => {
    const { token, username } = req.body;

    try {
        const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: `Bearer ${token}` },
        });

        const { sub: googleId, email, picture } = response.data;

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                email,
                googleId,
                avatar: picture,
                isProfileComplete: false,
            });
        } else if (!user.googleId) {
            return res.status(400).json({
                message: "This account was created without Google. Please use the regular login.",
            });
        }

        if (!user.isProfileComplete) {
            return res.status(202).json({
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                },
                requiresUsername: true,
                tempToken: generateToken(user, "1h"), // Short-lived token for completing profile
            });
        }

        const authToken = generateToken(user);
        res.status(200).json({
            user: {
                id: user._id,
                email: user.email,
                avatar: user.avatar,
                username: user.username,
            },
            token: authToken,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error during Google login. Please try again",
            error: error.message,
        });
    }
};

export const completeProfile = async (req, res) => {
    try {
        const { username } = req.body;
        const userId = req.user._id;

        const existingUsername = await User.findOne({ username });

        if (existingUsername) {
            return res.status(400).json({ message: "Username already taken" });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            {
                username,
                isProfileComplete: true,
            },
            { new: true }
        );

        const authToken = generateToken(user);
        res.status(200).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                username: user.username,
            },
            token: authToken,
        });
    } catch (error) {
        res.status(500).json({ message: "Error completing profile", error: error.message });
    }
};
