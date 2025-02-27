const Listing = require("./models/listing");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next)=>{
    // console.log(req.user);
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "user is not Authenticated");
        return res.redirect("/login");
    }
    next();
};


//now we are saving this url in our locals so that it could be accessible every where
module.exports.saveRedirectUrl = (req, res, next)=>{
    if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};


//this middleware check whether the current user is 
module.exports.ownerCheck = async (req, res, next)=>{
        let { id } = req.params;
        let listing = await Listing.findById(id);

        // 🔹 Ensure listing exists
        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }

        // 🔹 Authorization check: Only owner can update
        if (!res.locals.currentUser || !listing.owner.equals(res.locals.currentUser._id)) {
            req.flash("error", "You don't have permission to update this listing");
            return res.redirect(`/listings/${id}`);
        }
        next();
}




//this middleware check whether the current user is 
module.exports.isReviewAuthor = async (req, res, next)=>{
    let { id , reviewId } = req.params;
    let review = await Review.findById(reviewId);
    // 🔹 Authorization check: Only owner can update
    if (!res.locals.currentUser || !review.author.equals(res.locals.currentUser._id)) {
        req.flash("error", "You don't have permission to update this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}


