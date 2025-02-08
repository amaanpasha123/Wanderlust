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

module.exports.destroyReview = function _callee2(req, res) {
  var _req$params, id, reviewId, listing, review;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$params = req.params, id = _req$params.id, reviewId = _req$params.reviewId;
          _context2.next = 3;
          return regeneratorRuntime.awrap(Listing.findById(id));

        case 3:
          listing = _context2.sent;

          if (listing) {
            _context2.next = 6;
            break;
          }

          throw new ExpressError(404, "Listing not found");

        case 6:
          _context2.next = 8;
          return regeneratorRuntime.awrap(Review.findById(reviewId));

        case 8:
          review = _context2.sent;

          if (review) {
            _context2.next = 11;
            break;
          }

          throw new ExpressError(404, "Review not found");

        case 11:
          _context2.next = 13;
          return regeneratorRuntime.awrap(Listing.findByIdAndUpdate(id, {
            $pull: {
              reviews: reviewId
            }
          }));

        case 13:
          _context2.next = 15;
          return regeneratorRuntime.awrap(Review.findByIdAndDelete(reviewId));

        case 15:
          req.flash("success", "Review is deleted");
          res.redirect("/listings/".concat(id));

        case 17:
        case "end":
          return _context2.stop();
      }
    }
  });
};