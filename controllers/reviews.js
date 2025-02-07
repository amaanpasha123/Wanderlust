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










