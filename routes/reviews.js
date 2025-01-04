const express = require("express");
const router = express.Router(); // Fixed: Add parentheses to invoke Router
const wrapAsync = require("../utils/wrapAsyc.js");
const { reviewSchema } = require("../schema"); // Removed reviewSchema since it isn't used
const ExpressError = require("../utils/ExpressErrors");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");




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
router.delete("/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      throw new ExpressError(404, "Listing not found");
    }
    const review = await Review.findById(reviewId);
    if (!review) {
      throw new ExpressError(404, "Review not found");
    }
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
  }));
  
  
  
  // Create Review
router.post(
    "/:id/reviews",
    validateReview,
    wrapAsync(async (req, res) => {
      const listing = await Listing.findById(req.params.id);
      if (!listing) {
        throw new ExpressError(404, "Listing not found");
      }
      const newReview = new Review(req.body.review);
      listing.reviews.push(newReview);
      await newReview.save();
      await listing.save();
      res.redirect(`/listings/${listing._id}`);
    })
  );
  

module.exports = router;


