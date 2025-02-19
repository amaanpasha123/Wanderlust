"use strict";

var User = require("../models/user.js");

module.exports.renderSingupForm = function (req, res) {
  res.render("users/signup");
};

module.exports.SignUp = function _callee(req, res) {
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
};

module.exports.renderLoginForm = function (req, res) {
  res.render("users/login");
};

module.exports.logIn = function _callee2(req, res) {
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
};

module.exports.logOut = function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }

    req.flash("success", "you have properly logged out");
    res.redirect("/listings");
  });
};