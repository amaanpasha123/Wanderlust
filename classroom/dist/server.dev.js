"use strict";

var express = require("express");

var bodyParser = require("body-parser"); // To parse request bodies


var cookieParser = require("cookie-parser"); // To parse cookies


var app = express();

var users = require("./routes/user");

var posts = require("./routes/posts");

var session = require("express-session");

var sessionOptions = {
  secret: "mysecretid",
  resave: false,
  saveUninitialized: true
};
app.use(session(sessionOptions));
app.get("/register", function (req, res) {
  var _req$query$name = req.query.name,
      name = _req$query$name === void 0 ? "anonymous" : _req$query$name;
  res.send("".concat(name));
});
app.get("/hellow", function (req, res) {
  res.send("hellow");
}); // app.get("/reqcount", (req, res)=>{
//     //some where it counts the number of requests in the session made by the user....
//     if (req.session.count) {
//         req.session.count++;
//     } else {
//         req.session.count = 1;
//     }
//     res.send(`you send a request ${req.session.count} times`);
// });
// app.get("/test",(req, res)=>{
//     res.send("test successfull");
// });
// // Middleware
// app.use(cookieParser("secretCode")); // Enable cookie parsing
// app.use(bodyParser.json()); // Parse JSON bodies
// // Routers
// app.use("/users", users); // Common path for users
// app.use("/posts", posts); // Common path for posts
// //signed cookies........
// app.get("/signedcookies", (req, res)=>{
//     res.cookie("made in ", "india", {signed: true});
//     res.send("signed cookie send");
// });
// app.get("/verified", (req, res)=>{
//     console.log(req.signedCookies);
//     res.send("yes!!! verified");
// });
// // Set cookies
// app.get("/getcookies", (req, res) => {
//     res.cookie("greet", "hello!!", { secure: false });
//     res.cookie("Made in!!", "India");
//     res.send("hello this is cookies!!");
// });
// //greetcookie...
// app.get("/greet", (req, res)=>{
//     let{name = "anonymous"} = req.cookies;
//     res.send(`hii ${name}`);
// });
// // Home route
// app.get("/", (req, res) => {
//     console.dir(req.cookies); // Display cookies in console
//     res.send("Hi, I am welcoming you, baby! Aslamalaikum!");
// });
// Start the server

var PORT = 3000;
app.listen(PORT, function () {
  console.log("Server is listening on port ".concat(PORT));
});