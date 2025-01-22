"use strict";

var express = require("express");

var router = express.Router();

var User = require("../models/user");

router.get("/signup", function (req, res) {
  res.render("users/signup");
});
router.post("/sigup", function _callee(req, res) {
  var _req$body, username, id, password, newuser, registerUser;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, username = _req$body.username, id = _req$body.id, password = _req$body.password;
          newuser = new User({
            email: email,
            username: username
          });
          _context.next = 4;
          return regeneratorRuntime.awrap(User.register(newuser, password));

        case 4:
          registerUser = _context.sent;
          console.log(registerUser);
          req.flash("success", "user was registered");
          res.redirect("/listings");

        case 8:
        case "end":
          return _context.stop();
      }
    }
  });
});
module.exports = router;