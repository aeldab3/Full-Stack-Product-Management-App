const jwt = require("jsonwebtoken");
const httpStatusText = require("../utils/httpStatusText");
const AppError = require("../utils/appError");

const authorizeToken = (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"] || req.headers["Authorization"];
        if (!authHeader) {
            return next(new AppError("Unauthorized", 401, httpStatusText.FAIL));
        }
        const token = authHeader.split(" ")[1];
        const currentUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.currentUser = currentUser;
        next();
    }
    catch (e) {
        return next(new AppError("Invalid token", 401, httpStatusText.ERROR));
    }
}

module.exports = authorizeToken;