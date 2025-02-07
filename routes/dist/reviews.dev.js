"use strict";

var express = require("express");

var router = express.Router({
  mergeParams: true
}); // Fixed: Add parentheses to invoke Router

var wrapAsync = require("../utils/wrapAsyc.js");

var _require = require("../schema"),
    reviewSchema = _require.reviewSchema; // Removed reviewSchema since it isn't used


var ExpressError = require("../utils/ExpressErrors");

var Review = require("../models/review.js");

var Listing = require("../models/listing.js");

var _require2 = require("../middleware.js"),
    isLoggedIn = _require2.isLoggedIn,
    isReviewAuthor = _require2.isReviewAuthor;

var reviewController = require("../controllers/reviews.js");

var validateReview = function validateReview(req, res, next) {
  var _reviewSchema$validat = reviewSchema.validate(req.body),
      error = _reviewSchema$validat.error;

  if (error) {
    var errorMessage = error.details.map(function (el) {
      return el.message;
    }).join(", ");
    throw new ExpressError(400, errorMessage);
  } else {
    next();
  }
}; //deleting the review....


router["delete"]("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(function _callee(req, res) {
  var _req$params, id, reviewId, listing, review;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$params = req.params, id = _req$params.id, reviewId = _req$params.reviewId;
          _context.next = 3;
          return regeneratorRuntime.awrap(Listing.findById(id));

        case 3:
          listing = _context.sent;

          if (listing) {
            _context.next = 6;
            break;
          }

          throw new ExpressError(404, "Listing not found");

        case 6:
          _context.next = 8;
          return regeneratorRuntime.awrap(Review.findById(reviewId));

        case 8:
          review = _context.sent;

          if (review) {
            _context.next = 11;
            break;
          }

          throw new ExpressError(404, "Review not found");

        case 11:
          _context.next = 13;
          return regeneratorRuntime.awrap(Listing.findByIdAndUpdate(id, {
            $pull: {
              reviews: reviewId
            }
          }));

        case 13:
          _context.next = 15;
          return regeneratorRuntime.awrap(Review.findByIdAndDelete(reviewId));

        case 15:
          req.flash("success", "Review is deleted");
          res.redirect("/listings/".concat(id));

        case 17:
        case "end":
          return _context.stop();
      }
    }
  });
})); // Create Review

router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReviews));
module.exports = router;