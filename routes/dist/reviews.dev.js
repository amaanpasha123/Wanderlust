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


router["delete"]("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview)); // Create Review

router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReviews));
module.exports = router;