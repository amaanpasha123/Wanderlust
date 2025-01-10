"use strict";

var express = require("express");

var bodyParser = require("body-parser"); // To parse request bodies


var cookieParser = require("cookie-parser"); // To parse cookies


var session = require("express-session");

var flash = require("connect-flash");

var path = require("path");

var app = express(); // Importing routes (ensure these files exist and are correctly set up)

var users = require("./routes/user");

var posts = require("./routes/posts"); // EJS engine setup


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // Session configuration

var sessionOptions = {
  secret: "mysecretid",
  // Use a more secure and environment-specific secret in production
  resave: false,
  saveUninitialized: true
};
app.use(session(sessionOptions));
app.use(flash()); //middleware

app.use(function (req, res, next) {
  res.locals.successmsg = req.flash("success");
  res.locals.errormsg = req.flash("errors");
  next();
}); // Middleware for parsing request bodies and cookies

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(cookieParser()); // Routes

app.use("/users", users);
app.use("/posts", posts); // Register route

app.get("/register", function (req, res) {
  var _req$query$name = req.query.name,
      name = _req$query$name === void 0 ? "anonymous" : _req$query$name; // Default to "anonymous" if name is not provided

  req.session.name = name; // Store the name in session

  console.log("Registered name: ".concat(req.session.name)); // Log the session object for debugging

  if (name === "anonymous") {
    req.flash("errors", "you are not registered over here please register first");
  } else {
    req.flash("success", "Congratulations, you got selected!");
  }

  res.redirect("/hello");
});
app.get("/hello", function (req, res) {
  var userName = req.session.name; // Default to "Guest" if name is not in session
  // Corrected log statements

  console.log("Success message: ".concat(res.locals.successmsg));
  console.log("Error message: ".concat(res.locals.errormsg)); // Render the page with flash messages

  res.render("page.ejs", {
    name: userName,
    successmsg: res.locals.successmsg,
    errormsg: res.locals.errormsg
  });
}); // Port configuration

var PORT = process.env.PORT || 3000; // Start the server

app.listen(PORT, function () {
  console.log("Server is running on port ".concat(PORT));
}).on("error", function (err) {
  if (err.code === "EADDRINUSE") {
    console.error("Port ".concat(PORT, " is already in use. Please use a different port."));
  } else {
    console.error("Server error:", err);
  }
});