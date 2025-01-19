const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const AppError = require("../utils/appError");


const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const hashString = crypto.randomBytes(16).toString("hex");
        const filename = `product-${Date.now()}-${hashString}${ext}`;
        cb(null, filename);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);
    if (extname && mimeType) {
        return cb(null, true);
    }
    return cb(new AppError("Invalid file type, only jpeg, jpg and png are allowed", 400, httpStatusText.FAIL), false);
};

const upload = multer({ storage: diskStorage, fileFilter: fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

module.exports = upload;