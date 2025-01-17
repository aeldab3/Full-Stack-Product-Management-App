const express = require("express");
const Router = express.Router();
const productController = require("../controller/products.controller");
const allowedTo = require("../middlewares/allowedTo");
const authorizeToken = require("../middlewares/authorizeToken");
const userRole = require("../utils/userRoles");

Router.route("/")
    .get(authorizeToken, productController.getAllProducts)
    .post(authorizeToken, allowedTo(userRole.MANAGER, userRole.ADMIN), productController.createProduct);

Router.route("/:id")
    .get(authorizeToken, productController.getProductById)
    .patch(authorizeToken, allowedTo(userRole.MANAGER, userRole.ADMIN), productController.updateProduct)
    .delete(authorizeToken, allowedTo(userRole.MANAGER, userRole.ADMIN), productController.deleteProduct);

module.exports = Router