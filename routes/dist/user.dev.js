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
router.post("/signup", wrapAsync(function _callee(req, res) {
  var _req$body, username, email, password, newUser, registeredUser;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, username = _req$body.username, email = _req$body.email, password = _req$body.password;
          newUser = new User({
            email: email,
            username: username
          });
          _context.next = 4;
          return regeneratorRuntime.awrap(User.register(newUser, password));

        case 4:
          registeredUser = _context.sent;
          // console.log(registeredUser);
          req.login(registeredUser, function (err) {
            if (err) {
              return next(err);
            }

            req.flash("success", "User was registered successfully!");
            res.redirect(req.session.redirectUrl);
          });

        case 6:
        case "end":
          return _context.stop();
      }
    }
  });
})); // Login route

router.get("/login", function (req, res) {
  res.render("users/login");
});
router.post("/login", saveRedirectUrl, passport.authenticate("local", {
  failureRedirect: "/login",
  failureFlash: true
}), function _callee2(req, res) {
  var redirectUrl;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          req.flash("success", "welcome to with your account");
          redirectUrl = res.locals.redirectUrl || "/listings";
          res.redirect(redirectUrl);

        case 3:
        case "end":
          return _context2.stop();
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