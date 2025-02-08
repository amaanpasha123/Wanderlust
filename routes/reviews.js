const express = require("express");
const router = express.Router({mergeParams:true}); // Fixed: Add parentheses to invoke Router
const wrapAsync = require("../utils/wrapAsyc.js");
const { reviewSchema } = require("../schema"); // Removed reviewSchema since it isn't used
const ExpressError = require("../utils/ExpressErrors");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");



const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
      const errorMessage = error.details.map((el) => el.message).join(", ");
      throw new ExpressError(400, errorMessage);
    } else {
      next();
    }
  };

  
  //deleting the review....
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview));
  
  
  
  // Create Review
router.post(
    "/",
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.createReviews)
  );
  

module.exports = router;


