// Dependencies
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const Review = require("./models/review");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync"); // Corrected the import name
const ExpressError = require("./utils/ExpressError"); // Corrected filename
const { listingSchema, reviewSchema } = require("./schema.js");

// EJS engine setup
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Mongoose connection
mongoose
  .connect("mongodb://127.0.0.1:27017/WonderLust", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

// Validation middleware
const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const errorMessage = error.details.map((el) => el.message).join(", ");
    return next(new ExpressError(400, errorMessage));
  }
  next();
};

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errorMessage = error.details.map((el) => el.message).join(", ");
    return next(new ExpressError(400, errorMessage));
  }
  next();
};

// Routes

// Home Page - Redirect to Listings
app.get("/", (req, res) => {
  res.redirect("/listings");
});

// Index Route - List all listings
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
  })
);

// New Listing Form
app.get("/listings/new", (req, res) => {
  res.render("listings/new");
});

// Show Listing with Reviews
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id).populate("reviews").exec();
    if (!listing) {
      throw new ExpressError(404, "Listing not found");
    }
    res.render("listings/show", { listing });
  })
);

// Create New Listing
app.post(
  "/listings",
  validateListing,
  wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect(`/listings/${newListing._id}`);
  })
);

// Edit Listing Form
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      throw new ExpressError(404, "Listing not found");
    }
    res.render("listings/edit", { listing });
  })
);

// Update Listing
app.put(
  "/listings/:id",
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
    res.redirect(`/listings/${req.params.id}`);
  })
);

// Delete Listing
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    const deletedListing = await Listing.findByIdAndDelete(req.params.id);
    if (!deletedListing) {
      throw new ExpressError(404, "Listing not found");
    }
    res.redirect("/listings");
  })
);

// Create Review
app.post(
  "/listings/:id/reviews",
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

// Global Error Handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  console.error(err);
  res.status(statusCode).render("error", { message, statusCode });
});

// Start Server
app.listen(8080, () => {
  console.log("Server is running on port 8080");
});