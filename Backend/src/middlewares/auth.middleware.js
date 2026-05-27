import jwt from "jsonwebtoken";
export async function authMiddleware(req, res, next) {
    const token = req.cookies.token
    if (!token) {
        return res.status(401).json({
            message: "Unauthorized",
            success: false,
        });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
        return res.status(401).json({
            message: "Unauthorized",
            success: false,
        });
    }
    req.user = decoded;
    next();

}