const Users = require("../model/user.model");
const httpStatusText = require("../utils/httpStatusText");
const AppError = require("../utils/appError");
const userSchema = require("../validators/userValidator");
const asyncWrapper = require("../middlewares/asyncWrapper");
const bcrypt = require("bcrypt");
const generateJWT = require("../utils/generateJWT");

const getAllUsers = asyncWrapper(
    async (req, res, next) => {
        const query = req.query;
        const limit = query.limit || 5;
        const page = query.page || 1;
        const skip = (page - 1) * limit;
        
        const users = await Users.find({}, {"__v": 0, "password": 0}).limit(limit).skip(skip);
        return res.json({status: httpStatusText.SUCCESS, data: {users}});
    }
);

const getUserById = asyncWrapper(
    async (req, res, next) => {
        const user = await Users.findById(req.params.id, {"__v": 0, "password": 0, "confirmPassword": 0});
        if (!user) {
            return next(new AppError("User not found", 404, httpStatusText.FAIL));
        }
        return res.json({status: httpStatusText.SUCCESS, data: {user}});
    }
);


const deleteUser = asyncWrapper(
    async (req, res, next) => {
        const user = await Users.findByIdAndDelete(req.params.id);
        if (!user) {
            return next(new AppError("User not found", 404, httpStatusText.FAIL));
        }
        return res.json({status: httpStatusText.SUCCESS, data: null});
    }
);


const register = asyncWrapper(
    async (req, res, next) => {
        const { error } = userSchema.validate(req.body);
        if (error) {
            return next(new AppError(error.message, 400, httpStatusText.FAIL));
        }
        const { name, email, password, role, phones } = req.body;
        if (await Users.findOne({ name })) {
            return next(new AppError("Name already exists", 400, httpStatusText.FAIL));
        }
        if (await Users.findOne({ email })) {
            return next(new AppError("Email already exists", 400, httpStatusText.FAIL));
        }
        const phoneExists =  await Users.findOne({ phones: { $in: phones} });
        if (phoneExists) {
            return next(new AppError("Phone number already exists", 400, httpStatusText.FAIL));
        }

        const saltRound = 10;
        const hashPassword = await bcrypt.hash(password, saltRound);

        const user = await Users.create({
            name,
            email,
            password: hashPassword,
            role,
            phones,
        });
        const token = await generateJWT({ id: user._id, email: user.email, role: user.role})
        user.token = token;

        return res.status(201).json({status: httpStatusText.SUCCESS, data: {user}});
});

const login = asyncWrapper(
    async (req, res, next) => {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new AppError("email and password are required", 400, httpStatusText.FAIL));
        }
        const user = await Users.findOne({ email });
        if (!user) {
            return next(new AppError("User not found", 404, httpStatusText.FAIL));
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return next(new AppError("Invalid password", 401, httpStatusText.FAIL));
        }
        const token = await generateJWT({ id: user._id, email: user.email, role: user.role})
        return res.json({status: httpStatusText.SUCCESS, data: {token}});
    }
)

const logout = asyncWrapper(
    async (req, res, next) => {
        req.currentUser = null;
        return res.json({status: httpStatusText.SUCCESS, data: null});
});

module.exports = {
    getAllUsers,
    getUserById,
    deleteUser,
    register,
    login,
    logout
}