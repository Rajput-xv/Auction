const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
    let token;

    // Check for token in Authorization header
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }
    // Check for token in cookies
    else if (req.cookies && req.cookies.jwt) {
        token = req.cookies.jwt;
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

        // Proceed to the next middleware
        next();
    } catch (error) {
        res.status(401).json({ message: "Token is not valid" });
    }
};

module.exports = authMiddleware;
