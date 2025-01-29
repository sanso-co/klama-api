import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

import User from "../models/user";
import { UserType } from "../interfaces/user";

export const generateToken = (user: UserType, duration?: string) => {
    if (!process.env.JWT_KEY) {
        throw new Error("JWT_KEY is not defined in environment variables");
    }

    return jwt.sign(
        {
            _id: user._id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
        },
        process.env.JWT_KEY,
        { expiresIn: duration || "1d" }
    );
};

interface CustomRequest extends Request {
    user?: JwtPayload | string;
    refreshToken?: string;
}

export interface CustomJwtPayload extends JwtPayload {
    _id: string;
}

export const verifyToken = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            res.status(401).json({ message: "No token provided" });
            return;
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_KEY as string) as CustomJwtPayload;
            req.user = decoded;
            next();
        } catch (err) {
            if (err instanceof jwt.TokenExpiredError) {
                res.status(401).json({ message: "Token expired" });
                return;
            }
            if (err instanceof jwt.JsonWebTokenError) {
                res.status(401).json({ message: "Invalid token" });
                return;
            }
            res.status(500).json({ message: "Internal server error" });
            return;
        }
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
        return;
    }
};

export const verifyRefreshToken = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            res.status(401).json({ message: "No refresh token provided" });
            return;
        }

        try {
            const decoded = jwt.verify(
                refreshToken,
                process.env.JWT_KEY as string
            ) as CustomJwtPayload;
            const user = await User.findById(decoded._id);

            if (!user || user.refreshToken !== refreshToken) {
                res.status(401).json({ message: "Invalid refresh token" });
                return;
            }

            req.user = decoded;
            req.refreshToken = refreshToken;

            next();
        } catch (err) {
            if (err instanceof jwt.TokenExpiredError) {
                res.status(401).json({ message: "Refresh token expired" });
                return;
            }
            if (err instanceof jwt.JsonWebTokenError) {
                res.status(401).json({ message: "Invalid refresh token" });
                return;
            }
            res.status(500).json({ message: "Internal server error" });
            return;
        }
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
        return;
    }
};

export const checkAdmin = (req: CustomRequest, res: Response, next: NextFunction): void => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            res.status(401).json({ message: "Authorization failed. No token provided" });
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_KEY as string) as JwtPayload;

        if (!decoded.isAdmin) {
            res.status(403).json({ message: "Access denied. Admins only." });
            return;
        }

        req.user = decoded; // Attach decoded token to req.user
        next();
    } catch (error) {
        res.status(401).json({ message: "Authentication failed." });
        return;
    }
};

export const checkUserAccess = (req: CustomRequest, res: Response, next: NextFunction): void => {
    const { id } = req.params;
    const requestingUser = req.user as CustomJwtPayload;

    if (id !== requestingUser._id && !requestingUser.isAdmin) {
        res.status(403).json({
            message: "Access denied. You can only view your own profile or must be an admin.",
        });
        return;
    }

    next();
};
