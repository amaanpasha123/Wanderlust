const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReviews = async (req, res) => {
    console.log(req.params.id);
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      throw new ExpressError(404, "Listing not found");
    }
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "new review is created");
    res.redirect(`/listings/${listing._id}`);
}




module.exports.destroyReview = async (req, res) => {
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
    req.flash("success", "Review is deleted");
    res.redirect(`/listings/${id}`);
  };





