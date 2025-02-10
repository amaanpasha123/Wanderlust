"use strict";

var express = require("express");

var router = express.Router();

var User = require("../models/user.js");

var wrapAsync = require("../utils/wrapAsyc.js");

var passport = require("passport");

var _require = require("../middleware.js"),
    saveRedirectUrl = _require.saveRedirectUrl;

var userController = require("../controllers/user.js"); // Signup route


router.get("/signup", userController.renderSingupForm); //SignUp data is being trasfered over here........

router.post("/signup", wrapAsync(userController.SignUp)); // Login route

router.get("/login", userController.renderLoginForm);
router.post("/login", saveRedirectUrl, passport.authenticate("local", {
  failureRedirect: "/login",
  failureFlash: true
}), userController.logIn);
router.get("/logout", userController.logOut);
module.exports = router;