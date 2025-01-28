"use strict";

module.exports.isLoggedIn = function (req, res, next) {
  if (!req.isAuthenticated()) {
    req.flash("error", "user is not Authenticated");
    return res.redirect("/login");
  }
};