import { RequestHandler, Response } from "express";
import bcrypt from "bcryptjs";
import axios from "axios";
import { generateToken } from "../middleware/checkAuth";
import User from "../models/user";

const hashPassword = async (password: string | number) => {
    try {
        const passwordString = password.toString();
        const salt = await bcrypt.genSalt(10);
        const hashedResult = await bcrypt.hash(passwordString, salt);
        return hashedResult;
    } catch (error) {
        console.error("Error in hashPassword:", error);
        throw error;
    }
};

export const signup: RequestHandler = async (req, res) => {
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
            res.status(400).json({
                status: "error",
                message: errorMessage,
            });
            return;
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

        const { password: _, ...others } = newUser.toObject();

        res.status(200).json({ ...others, token });
    } catch (error: unknown) {
        console.log(error);
        res.status(500).json({
            status: "error",
            message: error instanceof Error ? error.message : "An error occurred during signup",
        });
    }
};

export const login: RequestHandler = async (req, res) => {
    const { username, password: userPassword } = req.body;
    try {
        const user = await User.findOne({ username });
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

        const isPasswordValid = await bcrypt.compare(userPassword.toString(), user.password);

        if (!isPasswordValid) {
            res.status(400).json({ message: "Invalid password" });
            return;
        }

        const token = generateToken(user);
        const { password, ...others } = user.toObject();
        res.status(200).json({ ...others, token });
    } catch (error: unknown) {
        res.status(500).json({
            status: "error",
            message: error instanceof Error ? error.message : "An error occurred during login",
        });
    }
};

export const googleAuth: RequestHandler = async (req, res) => {
    const { token } = req.body;

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
            res.status(400).json({
                message: "This account was created without Google. Please use the regular login.",
            });
            return;
        }

        if (!user.isProfileComplete) {
            res.status(202).json({
                user: {
                    _id: user._id,
                    email: user.email,
                    avatar: user.avatar,
                },
                requiresUsername: true,
                tempToken: generateToken(user, "1h"), // Short-lived token for completing profile
            });
            return;
        }

        const authToken = generateToken(user);
        res.status(200).json({
            user: {
                _id: user._id,
                email: user.email,
                avatar: user.avatar,
                username: user.username,
            },
            token: authToken,
        });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                message: "Error during Google login. Please try again",
                error: error.message,
            });
        } else {
            res.status(500).json({
                message: "Error during Google login. Please try again",
                error: "An unknown error occurred",
            });
        }
    }
};

export const completeProfile = async (req: any, res: Response) => {
    try {
        const { username } = req.body as { username: string };
        const userId = req.user?._id;

        const existingUsername = await User.findOne({ username });

        if (existingUsername) {
            res.status(400).json({ message: "Username already taken" });
            return;
        }

        const user = await User.findByIdAndUpdate(
            userId,
            {
                username: username,
                isProfileComplete: true,
            },
            { new: true }
        );

        if (!user) {
            res.status(400).json({ message: "Error updating username" });
            return;
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
    } catch (error: unknown) {
        res.status(500).json({
            status: "error",
            message:
                error instanceof Error
                    ? error.message
                    : "An error occurred during username creatiion",
        });
    }
};
