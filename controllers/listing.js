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
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url ,"..", filename);
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();

    req.flash("success", "Congratulations you created a new listings");
    res.redirect(`/listings`);
}


//Edit Exiting listings in listings.js this gives the form of listing
module.exports.editExistingListing = async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }
    res.render("listings/edit", { listing });
}


//Updation of listing... here we does and actuall updation in listing....
module.exports.updationOfListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    // 🔹 Update listing
    const updatedListing = await Listing.findByIdAndUpdate(
        id,
        req.body.listing,
        { new: true, runValidators: true }
    );
    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    updatedListing.image = {url, filename};
    await updatedListing.save();
    }
    req.flash("success", "Your listing has been updated!");
    res.redirect(`/listings/${id}`);
}


//Deletion of listings........
module.exports.deletionOfListing = async (req, res) => {
    const deletedListing = await Listing.findByIdAndDelete(req.params.id);
    if (!deletedListing) {
        throw new ExpressError(404, "Listing not found");
    }
    req.flash("success", "Listing is deleted");
    res.redirect("/listings");
}


