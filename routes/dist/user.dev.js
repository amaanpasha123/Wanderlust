"use strict";

var express = require("express");

var router = express.Router();
router.get("/signup", function (req, res) {
  res.send("form");
});
module.exports = router;