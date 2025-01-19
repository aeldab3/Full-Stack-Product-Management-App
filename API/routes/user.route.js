const express = require("express");
const Router = express.Router();
const userController = require("../controller/users.controller");
const authorizeToken = require("../middlewares/authorizeToken");
const allowedTo = require("../middlewares/allowedTo");
const userRole = require("../utils/userRoles");

Router.route("/")
    .get(authorizeToken, allowedTo(userRole.MANAGER, userRole.ADMIN), userController.getAllUsers)

Router.route("/:id")
    .get(authorizeToken, userController.getUserById)
    .patch(authorizeToken, userController.updateUser)
    .delete(authorizeToken, allowedTo(userRole.MANAGER), userController.deleteUser);

Router.route("/register")
    .post(userController.register);

Router.route("/login")
    .post(userController.login);

Router.route("/logout")
    .post(authorizeToken, userController.logout);

module.exports = Router

