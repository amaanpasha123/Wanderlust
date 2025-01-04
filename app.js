// Dependencies
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const Review = require("./models/review");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsyc.js"); // Corrected the import name// Corrected the import name
const ExpressError = require("./utils/ExpressErrors"); // Corrected filename
const { listingSchema, reviewSchema } = require("./schema.js");
//routers
const listings = require("./routes/listing.js");
const reviews = require("./routes/reviews.js");


// EJS engine setup
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

mongoose
  .connect("mongodb://127.0.0.1:27017/WonderLust") // Removed options
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
    throw new ExpressError(400, errorMessage);
  } else {
    next();
  }
};

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errorMessage = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(400, errorMessage);
  } else {
    next();
  }
};

//usage of routers......

app.use("/listings",listings);

app.use("/listings", reviews);

// Home Page - Redirect to Listings
app.get("/", (req, res) => {
  res.redirect("/listings");
});


app.get("/listings/:id", wrapAsync(async (req, res) => {
  let {id} = req.params;
  const listing = await Listing.findById(id).populate("reviews"); 
  res.render("listings/show", { listing });
}));

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

