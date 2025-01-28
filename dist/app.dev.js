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


var listingRouter = require("./routes/listing.js");

var reviewsRouter = require("./routes/reviews.js");

var usersRouter = require("./routes/user.js"); //session for some small task 


var sessions = require("express-session");

var flash = require("connect-flash"); //for the purpose of flash messages.....
//passport


var passport = require("passport");

var LocalStrategy = require("passport-local");

var User = require("./models/user.js"); //schema this is
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
  // Replace this with an environment variable in production
  resave: false,
  saveUninitialized: true // cookie: {
  //   maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie lifetime: 7 days in milliseconds
  //   httpOnly: true, // Helps prevent XSS attacks
  // },

};
app.use(sessions(sessionOptions));
app.use(flash()); //passport session in this......

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
app.use(function (req, res, next) {
  res.locals.currentUser = req.user || null; // Make `currentUser` accessible in all templates

  res.locals.successmsg = req.flash("success");
  res.locals.error = req.flash("error");
  console.log(res.locals.successmsg);
  next();
}); //demo of user
// app.get("/demoUser", async (req, res, next) => {
//   try {
//     const existingUser = await User.findOne({ username: "sigma-student" });
//     if (existingUser) {
//       return res.status(400).send("User with this username already exists.");
//     }
//     const fakeUser = new User({
//       email: "student2@gmail.com",
//       username: "sigma2-student",
//     });
//     const registerUser = await User.register(fakeUser, "theamaanmustafa");
//     res.send(registerUser);
//   } catch (err) {
//     if (err.name === "UserExistsError") {
//       return res.status(400).send("User already exists. Please use a different username.");
//     }
//     console.error("Unexpected error:", err);
//     res.status(500).send("An unexpected error occurred.");
//   }
// });
//usage of routers......

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", usersRouter); // use static serialize and deserialize of model for passport session support

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
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