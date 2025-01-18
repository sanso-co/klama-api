import jwt, { JwtPayload } from "jsonwebtoken";
import { UserType } from "../interfaces/user";
import { Request, Response, NextFunction } from "express";

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

        const decoded = jwt.verify(token, process.env.JWT_KEY as string) as CustomJwtPayload;
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
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
