const Listing = require("../models/listing");
const mongoose = require("mongoose");


module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
};



//rendering new form of listings.....
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new");
}

//showing a single and particular listing over here...
module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        req.flash("error", "Invalid listing ID");
        return res.redirect("/listings");
    }
    const listing = await Listing.findById(id)
    .populate({path : "reviews",
        populate : {path : "author"}
    })
    .populate("owner");
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    res.render("./listings/show.ejs", { listing });
}



//Create new listing it means it is a post route
module.exports.createListing = async (req, res) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "Congratulations you created a new listings");
    res.redirect(`/listings`);
}



