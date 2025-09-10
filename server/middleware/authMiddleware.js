const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
    let token;

    // Check for token in cookies first (prioritize this)
    if (req.cookies && req.cookies.jwt) {
        token = req.cookies.jwt;
    }
    // Then check for token in Authorization header
    else if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    // If no token is found, return an error
    if (!token) {
        return res
            .status(401)
            .json({ message: "No token, authorization denied" });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the user to the request object
        req.user = await User.findById(decoded.id).select("-password");

        // If user not found in database
        if (!req.user) {
            return res.status(401).json({ message: "User not found" });
        }

        // Proceed to the next middleware
        next();
    } catch (error) {
        console.error("Auth middleware error:", error);
        res.status(401).json({ message: "Token is not valid" });
    }
};

module.exports = authMiddleware;
