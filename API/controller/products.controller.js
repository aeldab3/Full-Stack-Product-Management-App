const Products = require("../model/product.model");
const httpStatusText = require("../utils/httpStatusText");
const AppError = require("../utils/appError");
const productSchema = require("../validators/productValidator");
const asyncWrapper = require("../middlewares/asyncWrapper");
const Categories = require("../model/category.model");
const cloudinary = require("../config/cloudinary");
const fs = require("fs/promises");
const path = require("path");

const getAllProducts = asyncWrapper(async (req, res, next) => {
    const query = req.query;
    const limit = parseInt(query.limit) || 12;
    const page = parseInt(query.page) || 1;
    const skip = (page - 1) * limit;
  
    let filter = {};
    if (query.catId && query.catId !== '0') { 
      filter.catId = query.catId;
    }

    if (query.search) {
      filter.name = { $regex: query.search, $options: 'i' };
    }
  
    const totalProducts = await Products.countDocuments(filter);
    const products = await Products.find(filter, { "__v": 0 }).limit(limit).skip(skip);
  
    res.json({
      status: httpStatusText.SUCCESS,
      data: {
        products,
        totalProducts,
        totalPages: Math.ceil(totalProducts / limit),
        currentPage: page,
      },
    });
  });
  

const getProductById = asyncWrapper(async (req, res, next) => {
  const product = await Products.findById(req.params.id, { __v: 0 });
  if (!product) {
    return next(new AppError("Product not found", 404, httpStatusText.FAIL));
  }
  return res.json({ status: httpStatusText.SUCCESS, data: { product } });
});

const createProduct = asyncWrapper(async (req, res, next) => {
  const { error } = productSchema.validate(req.body);
  if (error) {
    if (req.file) await fs.unlink(req.file.path);
    return next(new AppError(error.message, 400, httpStatusText.FAIL));
  }

  const categoryExists = await Categories.findById(req.body.catId);
  if (!categoryExists) {
    if (req.file) await fs.unlink(req.file.path);
    return next(new AppError("Category not found", 404, httpStatusText.FAIL));
  }

  // Upload image to Cloudinary
  let productImageUrl = null;
  if (req.file) {
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "productsImages",
        transformation: [{ width: 800, height: 800, crop: "limit" }],
      });
      productImageUrl = result.secure_url;
    } catch (uploadError) {
      await fs.unlink(req.file.path);
      return next(new AppError("Failed to upload product image", 500));
    } finally {
      await fs.unlink(req.file.path);
    }
  }

  const newProduct = new Products({ ...req.body, imageUrl: productImageUrl });
  await newProduct.save();
  return res
    .status(201)
    .json({ status: httpStatusText.SUCCESS, data: { product: newProduct } });
});

const updateProduct = asyncWrapper(async (req, res, next) => {
  const { error } = productSchema.validate(req.body);
  if (error) {
    if (req.file) await fs.unlink(req.file.path);
    return next(new AppError(error.message, 400, httpStatusText.FAIL));
  }

  let updateData = { ...req.body };

  if (req.file) {
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "productsImages",
        transformation: [{ width: 800, height: 800, crop: "limit" }],
      });

      updateData.imageUrl = result.secure_url;

      // Remove the old image from Cloudinary (if exists)
      const product = await Products.findById(req.params.id);
      if (product && product.imageUrl) {
        const oldImagePublicId = product.imageUrl
          .split("/")
          .slice(-1)[0]
          .split(".")[0];
        await cloudinary.uploader.destroy(`productsImages/${oldImagePublicId}`);
      }
    } catch (err) {
      await fs.unlink(req.file.path);
      return next(new AppError("Failed to upload image to Cloudinary", 500));
    } finally {
      await fs.unlink(req.file.path);
    }
  }

  const updatedProduct = await Products.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true }
  );
  if (!updatedProduct) {
    return next(new AppError("Product not found", 404, httpStatusText.FAIL));
  }

  return res.json({
    status: httpStatusText.SUCCESS,
    data: { product: updatedProduct },
  });
});

const deleteProduct = asyncWrapper(async (req, res, next) => {
  const product = await Products.findById(req.params.id);
  if (!product) {
    return next(new AppError("Product not found", 404, httpStatusText.FAIL));
  }

  if (product.imageUrl) {
    const oldImagePublicId = product.imageUrl
      .split("/")
      .slice(-1)[0]
      .split(".")[0];
    await cloudinary.uploader.destroy(`productsImages/${oldImagePublicId}`);
  }

  await Products.deleteOne({ _id: req.params.id });
  return res.json({ status: httpStatusText.SUCCESS, data: { product: null } });
});

const gatAllCategories = asyncWrapper(async (req, res, next) => {
  const categories = await Categories.find();
  return res.json({ status: httpStatusText.SUCCESS, data: { categories } });
});

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  gatAllCategories,
};
