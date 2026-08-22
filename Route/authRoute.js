const express = require("express")
const Router = express.Router();
const {signUp, login, forgotPassword, resetPassword} = require("../Controllers/auth")

Router.post("/signup", signUp);
Router.post("/login", login);
Router.post("/forgot-password", forgotPassword);
Router.post("/reset-password/:token", resetPassword);


module.exports = Router