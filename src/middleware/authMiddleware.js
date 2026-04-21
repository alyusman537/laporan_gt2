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