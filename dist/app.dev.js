"use strict";

// Dependencies
var express = require("express");

var app = express();

var mongoose = require("mongoose");

var Listing = require("./models/listing.js");

var Review = require("./models/review.js");

var path = require("path");

var methodOverride = require("method-override");

var ejsMate = require("ejs-mate");

var wrapAsync = require("./utils/wrapAsyc.js"); // Corrected the import name// Corrected the import name


var ExpressError = require("./utils/ExpressErrors.js"); // Corrected filename


var _require = require("./schema.js"),
    listingSchema = _require.listingSchema,
    reviewSchema = _require.reviewSchema; //routers


var listings = require("./routes/listing.js");

var reviews = require("./routes/reviews.js"); //session for some small task 


var sessions = require("express-session");

var flash = require("connect-flash"); //for the purpose of flash messages.....
// EJS engine setup


app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // Middleware

app.use(express["static"](path.join(__dirname, "public")));
app.use(express.urlencoded({
  extended: true
}));
app.use(methodOverride("_method"));
var sessionOptions = {
  secret: "mysecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 100,
    maxage: 7 * 24 * 60 * 60 * 100,
    httpOnly: true
  }
};
app.use(sessions(sessionOptions));
app.use(flash());
app.use(function (req, res, next) {
  res.locals.successmsg = req.flash("success");
}); //usage of routers......

app.use("/listings", listings);
app.use("/listings", reviews);
mongoose.connect("mongodb://127.0.0.1:27017/WonderLust") // Removed options
.then(function () {
  console.log("Connected to MongoDB");
})["catch"](function (err) {
  console.error("Failed to connect to MongoDB", err);
}); // Home Page - Redirect to Listings

app.get("/", function (req, res) {
  res.redirect("/listings");
});
app.get("/listings/:id", wrapAsync(function _callee(req, res) {
  var id, listing;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          id = req.params.id;
          _context.next = 3;
          return regeneratorRuntime.awrap(Listing.findById(id).populate("reviews"));

        case 3:
          listing = _context.sent;
          res.render("listings/show", {
            listing: listing
          });

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
})); // Global Error Handler

app.use(function (err, req, res, next) {
  var _err$statusCode = err.statusCode,
      statusCode = _err$statusCode === void 0 ? 500 : _err$statusCode,
      _err$message = err.message,
      message = _err$message === void 0 ? "Something went wrong!" : _err$message;
  console.error(err);
  res.status(statusCode).render("error", {
    message: message,
    statusCode: statusCode
  });
}); // Start Server

app.listen(8080, function () {
  console.log("Server is running on port 8080");
});