"use strict";

var express = require("express");

var router = express.Router();

var User = require("../models/user");

var wrapAsyc = require("../utils/wrapAsyc");

router.get("/signup", function (req, res) {
  res.render("users/signup");
});
router.post("/signup", wrapAsyc(function _callee(req, res) {
  var _req$body, username, email, password, newuser, registerUser;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, username = _req$body.username, email = _req$body.email, password = _req$body.password;
          newuser = new User({
            email: email,
            username: username
          });
          _context.next = 5;
          return regeneratorRuntime.awrap(User.register(newuser, password));

        case 5:
          registerUser = _context.sent;
          console.log(registerUser);
          req.flash("success", "user was registered");
          res.redirect("/listings");
          _context.next = 15;
          break;

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](0);
          req.flash("error", _context.t0.message);
          res.redirect("/signup");

        case 15:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 11]]);
}));
module.exports = router;