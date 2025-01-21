"use strict";

var express = require("express");

var router = express.Router();

var User = require("..models/user.js");

router.get("/signup", function (req, res) {
  res.render("users/signup");
});
router.post("/sigup", function _callee(req, res) {
  var _req$body, username, id, password;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, username = _req$body.username, id = _req$body.id, password = _req$body.password;

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
});
module.exports = router;