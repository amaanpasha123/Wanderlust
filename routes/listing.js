const express = require("express");
const router = express.Router(); // Fixed: Add parentheses to invoke Router
const wrapAsync = require("../utils/wrapAsyc.js");
const { listingSchema } = require("../schema"); // Removed reviewSchema since it isn't used
const ExpressError = require("../utils/ExpressErrors");
const Listing = require("../models/listing");
const {isLoggedIn} = require("../middleware.js");
const {ownerCheck} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const mongoose = require("mongoose");

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
    wrapAsync(listingController.index)
);

// New Listing Form
router.get("/new", isLoggedIn, listingController.renderNewForm);



//Show route of listings.........
router.get(
    "/:id",
    wrapAsync(listingController.showListing)
);



// Create New Listing
router.post(
    "/",
    validateListing,
    wrapAsync(listingController.createListing)
);


// Edit Listing Form
router.get(
    "/:id/edit",
    isLoggedIn,
    wrapAsync(listingController.editExistingListing)
);

// Update Listing
router.put(
    "/:id",
    isLoggedIn,
    ownerCheck,
    validateListing,
    wrapAsync(listingController.updationOfListing)
);

// Delete Listing
router.delete(
    "/:id",
    isLoggedIn,
    ownerCheck,
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