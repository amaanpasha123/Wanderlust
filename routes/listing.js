const express = require("express");
const router = express.Router(); // Fixed: Add parentheses to invoke Router
const wrapAsync = require("../utils/wrapAsyc.js");
const { listingSchema } = require("../schema"); // Removed reviewSchema since it isn't used
const ExpressError = require("../utils/ExpressErrors");
const Listing = require("../models/listing");
const {isLoggedIn} = require("../middleware.js");

// Validation middleware
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errorMessage = error.details.map((el) => el.message).join(", ");
        next(new ExpressError(400, errorMessage)); // Pass error to the middleware chain
    } else {
        next();
    }
};

// Index Route - List all listings
router.get(
    "/",
    wrapAsync(async (req, res) => {
        const allListings = await Listing.find({});
        res.render("listings/index", { allListings });
    })
);

// New Listing Form
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new");
});

// // Show route
// router.get(
//     "/:id",
//     wrapAsync(async (req, res) => {
//       let { id } = req.params;
//       const listing = await Listing.findById(id).populate("reviews");
//         if(!listing){
//             req.flash("error","listing you created doesn't exist");
//             res.redirect("/listings");
//         }
//       res.render("./listings/show.ejs", { listing, id});
//     })
//     );

const mongoose = require("mongoose");

router.get(
    "/:id",
    wrapAsync(async (req, res) => {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            req.flash("error", "Invalid listing ID");
            return res.redirect("/listings");
        }
        const listing = await Listing.findById(id).populate("reviews");
        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }
        res.render("./listings/show.ejs", { listing });
    })
);



// Create New Listing
router.post(
    "/",
    validateListing,
    wrapAsync(async (req, res) => {
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        req.flash("success", "Congratulations you created a new listings");
        res.redirect(`/listings`);
    })
);


// Edit Listing Form
router.get(
    "/:id/edit",
    isLoggedIn,
    wrapAsync(async (req, res) => {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            throw new ExpressError(404, "Listing not found");
        }
        res.render("listings/edit", { listing });
    })
);

// Update Listing
router.put(
    "/:id",
    isLoggedIn,
    validateListing,
    wrapAsync(async (req, res) => {
        const updatedListing = await Listing.findByIdAndUpdate(
            req.params.id,
            req.body.listing,
            { new: true, runValidators: true }
        );
        if (!updatedListing) {
            throw new ExpressError(404, "Listing not found");
        }
        req.flash("success","you listing is updated");
        res.redirect(`/listings/${req.params.id}`);
    })
);

// Delete Listing
router.delete(
    "/:id",
    isLoggedIn,
    wrapAsync(async (req, res) => {
        const deletedListing = await Listing.findByIdAndDelete(req.params.id);
        if (!deletedListing) {
            throw new ExpressError(404, "Listing not found");
        }
        req.flash("success", "Listing is deleted");
        res.redirect("/listings");
    })
);

module.exports = router;
