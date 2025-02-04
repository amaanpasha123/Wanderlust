// Dependencies
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsyc.js"); // Corrected the import name// Corrected the import name
const ExpressError = require("./utils/ExpressErrors.js"); // Corrected filename
const { listingSchema, reviewSchema } = require("./schema.js");
//routers
const listingRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/reviews.js");
const usersRouter = require("./routes/user.js");
//session for some small task 
const sessions = require("express-session");
const flash = require("connect-flash");//for the purpose of flash messages.....
//passport
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");//schema this is



// EJS engine setup
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));



const sessionOptions = {
  secret: "mysecretcode", // Replace this with an environment variable in production
  resave: false,
  saveUninitialized: true,
  // cookie: {
  //   maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie lifetime: 7 days in milliseconds
  //   httpOnly: true, // Helps prevent XSS attacks
  // },
};


app.use(sessions(sessionOptions));
app.use(flash());

//passport session in this......
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));





app.use((req, res, next) => {
  res.locals.currentUser = req.user || null; // Make `currentUser` accessible in all templates
  res.locals.successmsg = req.flash("success");
  res.locals.error = req.flash("error");
  console.log(res.locals.successmsg);
  next();
});




//usage of routers......
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", usersRouter);

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



mongoose
  .connect("mongodb://127.0.0.1:27017/WonderLust") // Removed options
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
});




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


