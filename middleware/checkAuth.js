import jwt from "jsonwebtoken";

export const generateToken = (user) => {
    return jwt.sign(
        {
            _id: user._id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
        },
        process.env.JWT_KEY,
        { expiresIn: "1d" }
    );
};

export const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

export const checkToken = (req, res, next) => {
    const authorization = req.headers.authorization;

    if (authorization) {
        const token = authorization.split(" ")[1];
        jwt.verify(token, process.env.JWT_KEY, (error, user) => {
            if (error) {
                return res.status(403).json("Invalid token");
            }
            req.user = user;
            next();
        });
    } else {
        return res.status(401).json("You are not authenticated");
    }
};

export const checkAdmin = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Authorization failed. No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_KEY);

        if (!decoded.isAdmin) {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Authentication failed." });
    }
};
