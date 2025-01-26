"use strict";

var express = require("express");

var router = express.Router();

var User = require("../models/user.js");

var wrapAsync = require("../utils/wrapAsyc.js");

var passport = require("passport"); // Signup route


router.get("/signup", function (req, res) {
  res.render("users/signup");
});
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
          console.log(registeredUser);
          req.flash("success", "User was registered successfully!");
          res.redirect("/listings");

        case 8:
        case "end":
          return _context.stop();
      }
    }
  });
})); // Login route

router.get("/login", function (req, res) {
  res.render("users/login");
});
router.post("/login", passport.authenticate("local", {
  failureRedirect: "/login",
  failureFlash: true
}), function _callee2(req, res) {
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          req.flash("success", "welcome to with your account");
          res.redirect("/listings");

        case 2:
        case "end":
          return _context2.stop();
      }
    }
  });
});
module.exports = router;