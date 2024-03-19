const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require('passport');
const { savedRedirectUrl } = require("../middleware.js");
const userController = require("../controller/user.js");

//signup
router.get("/signup",userController.renderSignupForm);

router.post("/signup", wrapAsync(userController.signup));

//login
router.get("/login",userController.renderLoginForm);

router.post("/login",savedRedirectUrl,passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}) ,userController.login)

router.get("/logout",userController.logout);

module.exports = router;