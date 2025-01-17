const httpStatusText = require("../utils/httpStatusText");

const errorHandler = (err, req, res, next) => {
    return res.status(err.statusCode || 500).json({
        status: err.statusText || httpStatusText.ERROR,
        message: err.message || "Something went wrong",
        code: err.statusCode || 500,
        data: null
    });
};

module.exports = errorHandler;