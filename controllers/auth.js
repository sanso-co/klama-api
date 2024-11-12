import User from "../models/user.js";
import crypto from "crypto";
import { generateToken } from "../middleware/checkAuth.js";

const hashPassword = (password) => {
    return crypto.createHash("sha256").update(password).digest("hex");
};

//signup
export const signup = async (req, res) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });

        if (existingUser) return res.status(400).json("User already exists with that email");

        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashPassword(req.body.password),
        });

        const token = generateToken(newUser);

        const { password, ...others } = newUser._doc;

        res.status(200).json({ ...others, token });
    } catch (error) {
        res.status(500).json(error);
    }
};

//signin
export const login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ message: "User does not exist with this email" });
        }
        const savedPassword = user.password;
        const hashedPassword = hashPassword(req.body.password);

        if (savedPassword !== hashedPassword) {
            return res.status(400).json({ message: "Wrong password" });
        }
        const token = generateToken(user);
        const { password, ...others } = user._doc;
        res.status(200).json({ ...others, token });
    } catch (error) {
        res.status(500).json(error);
    }
};
