import { RequestHandler } from "express";
import User from "../models/user";
import mongoose from "mongoose";

export const getUserDetails: RequestHandler = async (req, res) => {
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid user ID format" });
            return;
        }

        const details = await User.findById(id);

        if (!details) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.status(200).json(details);
    } catch (error) {
        res.status(500).json(error);
    }
};
