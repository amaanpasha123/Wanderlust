"use strict";

var Listing = require("./models/listing");

module.exports.isLoggedIn = function (req, res, next) {
  // console.log(req.user);
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "user is not Authenticated");
    return res.redirect("/login");
  }

  next();
}; //now we are saving this url in our locals so that it could be accessible every where


module.exports.saveRedirectUrl = function (req, res, next) {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }

  next();
}; //this middleware check whether the current user is 


module.exports.ownerCheck = function _callee(req, res, next) {
  var id, listing;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          id = req.params.id;
          _context.next = 3;
          return regeneratorRuntime.awrap(Listing.findById(id));

        case 3:
          listing = _context.sent;

          if (listing) {
            _context.next = 7;
            break;
          }

          req.flash("error", "Listing not found");
          return _context.abrupt("return", res.redirect("/listings"));

        case 7:
          if (!(!res.locals.currentUser || !listing.owner.equals(res.locals.currentUser._id))) {
            _context.next = 10;
            break;
          }

          req.flash("error", "You don't have permission to update this listing");
          return _context.abrupt("return", res.redirect("/listings/".concat(id)));

        case 10:
          // 🔹 Handle missing image (prevent validation error)
          if (!req.body.listing.image || req.body.listing.image.trim() === "") {
            req.body.listing.image = "/images/default.jpg"; // Set default image
          }

        case 11:
        case "end":
          return _context.stop();
      }
    }
  });
};