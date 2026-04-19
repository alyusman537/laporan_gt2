import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Cek apakah header Authorization ada dan formatnya "Bearer <token>"
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Menyimpan data user (id & level) ke object request
        next();
    } catch (error) {
        return res.status(403).json({ message: "Forbidden: Invalid or expired token" });
    }
};

export const role = {
    isAdmin: (req, res, next) => {
        // Mengecek apakah level user yang login adalah admin
        if (req.user && req.user.level.toLowerCase() === 'admin') {
            next();
        } else {
            return res.status(403).json({ message: "Access denied: Admin role required" });
        }
    },
    isPjgt: (req, res, next) => {
        // Mengecek apakah level user yang login adalah admin
        if (req.user && req.user.level.toLowerCase() === 'pjgt') {
            next();
        } else {
            return res.status(403).json({ message: "Access denied: PJGT role required" });
        }
    },
    isGt: (req, res, next) => {
        // Mengecek apakah level user yang login adalah admin
        if (req.user && req.user.level.toLowerCase() === 'gt') {
            next();
        } else {
            return res.status(403).json({ message: "Access denied: GT role required" });
        }
    }
};