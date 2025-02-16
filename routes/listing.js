if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

require('dotenv').config();
console.log(process.env.SECRET);

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
const multer  = require('multer');

const {storage} = require("../cloudconfig.js");
const upload = multer({ storage });//multer will save this in cloud storage directly.

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
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
);


// router.post("/", upload.single('listing[image]'), (req, res)=>{
//     res.send(req.file);
// });



// Edit Listing Form .. it only renders the form of updation of listing
router.get(
    "/:id/edit",
    isLoggedIn,
    wrapAsync(listingController.editExistingListing)
);

// Update Listing Actuall editing done in databases
router.put(
    "/:id",
    isLoggedIn,
    ownerCheck,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updationOfListing)
);

// Delete Listing
router.delete(
    "/:id",
    isLoggedIn,
    ownerCheck,
    wrapAsync(listingController.deletionOfListing)
);

module.exports = router;



