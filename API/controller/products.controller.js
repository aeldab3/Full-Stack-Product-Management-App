const Products = require("../model/product.model");
const httpStatusText = require("../utils/httpStatusText");
const AppError = require("../utils/appError");
const productSchema = require("../validators/productValidator");
const asyncWrapper = require("../middlewares/asyncWrapper");
const Categories = require("../model/category.model");
const getAllProducts = asyncWrapper(
    async (req, res, next) => {
        const query = req.query;
        const limit = query.limit || 5;
        const page = query.page || 1;
        const skip = (page - 1) * limit;

        const filter = catId ? { catId } : {};

        const products = await Products.find(filter, {"__v": 0}).limit(limit).skip(skip);
        res.json({status: httpStatusText.SUCCESS, data: {products}});
});

const getProductById = asyncWrapper(
    async (req, res, next) => {
        const product = await Products.findById(req.params.id, {"__v": 0});
        if (!product) {
            return next(new AppError("Product not found", 404, httpStatusText.FAIL));
        }
        return res.json({status: httpStatusText.SUCCESS, data: {product}});
        }
    );

const createProduct = asyncWrapper(
    async (req, res, next) => {
        const {error} = productSchema.validate(req.body);
        if (error) {
            return next(new AppError(error.message, 400, httpStatusText.FAIL));
        }

        // Check if the category exists
        const categoryExists = await Categories.findById(req.body.catId);
        if (!categoryExists) {
            return next(new AppError("Category not found", 404, httpStatusText.FAIL));
        }

        const newProduct = new Products(req.body);
        await newProduct.save();
        return res.status(201).json({status: httpStatusText.SUCCESS, data: {product: newProduct}});
    }
);

const updateProduct = asyncWrapper(
    async (req, res, next) => {
        const {error} = productSchema.validate(req.body);
        if (error) {
            return next(new AppError(error.message, 400, httpStatusText.FAIL));
        }
        const updateProduct = await Products.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if (!updateProduct) {
            return next(new AppError("Product not found", 404, httpStatusText.FAIL));
        }
        return res.json({status: httpStatusText.SUCCESS, data: {product: updateProduct}});
    }
);

const deleteProduct = asyncWrapper(
    async (req, res, next) => {
        try {
            const deleteProduct = await Products.deleteOne({_id: req.params.id});
            if (!deleteProduct) {
                return next(new AppError("Product not found", 404, httpStatusText.FAIL));
            }
            return res.json({status: httpStatusText.SUCCESS, data: {product: null}});
        }
        catch (err) {
            return next(new AppError(err.message, 500, httpStatusText.ERROR));
        }
    }
);

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
}