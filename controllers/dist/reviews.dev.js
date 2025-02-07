"use strict";

var Listing = require("../models/listing");

var Review = require("../models/review");

module.exports.createReviews = function _callee(req, res) {
  var listing, newReview;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log(req.params.id);
          _context.next = 3;
          return regeneratorRuntime.awrap(Listing.findById(req.params.id));

        case 3:
          listing = _context.sent;

          if (listing) {
            _context.next = 6;
            break;
          }

          throw new ExpressError(404, "Listing not found");

        case 6:
          newReview = new Review(req.body.review);
          newReview.author = req.user._id;
          listing.reviews.push(newReview);
          _context.next = 11;
          return regeneratorRuntime.awrap(newReview.save());

        case 11:
          _context.next = 13;
          return regeneratorRuntime.awrap(listing.save());

        case 13:
          req.flash("success", "new review is created");
          res.redirect("/listings/".concat(listing._id));

        case 15:
        case "end":
          return _context.stop();
      }
    }
  });
};