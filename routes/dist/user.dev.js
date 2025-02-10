"use strict";

var express = require("express");

var router = express.Router();

var User = require("../models/user.js");

var wrapAsync = require("../utils/wrapAsyc.js");

var passport = require("passport");

var _require = require("../middleware.js"),
    saveRedirectUrl = _require.saveRedirectUrl;

var userController = require("../controllers/user.js"); // Signup route


router.get("/signup", userController.renderSingupForm);
router.post("/signup", wrapAsync(userController.SignUp)); // Login route

router.get("/login", function (req, res) {
  res.render("users/login");
});
router.post("/login", saveRedirectUrl, passport.authenticate("local", {
  failureRedirect: "/login",
  failureFlash: true
}), function _callee(req, res) {
  var redirectUrl;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          req.flash("success", "welcome to with your account");
          redirectUrl = res.locals.redirectUrl || "/listings";
          res.redirect(redirectUrl);

        case 3:
        case "end":
          return _context.stop();
      }
    }
  });
});
router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }

    req.flash("success", "you have properly logged out");
    res.redirect("/listings");
  });
});
module.exports = router;