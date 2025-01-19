"use strict";

var express = require("express");

var router = express.Router();
router.get("/signup", function (req, res) {
  res.render("user/signup");
});
module.exports = router;