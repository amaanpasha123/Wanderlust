const express = require("express");
const bodyParser = require("body-parser"); // To parse request bodies
const cookieParser = require("cookie-parser"); // To parse cookies
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

const app = express();

// Importing routes (ensure these files exist and are correctly set up)
const users = require("./routes/user");
const posts = require("./routes/posts");

// EJS engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Session configuration
const sessionOptions = {
    secret: "mysecretid", // Use a more secure and environment-specific secret in production
    resave: false,
    saveUninitialized: true
};
app.use(session(sessionOptions));
app.use(flash());
//middleware
app.use((req, res, next)=>{
    res.locals.successmsg = req.flash("success");
    res.locals.errormsg = req.flash("errors");
    next();
});

// Middleware for parsing request bodies and cookies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Routes
app.use("/users", users);
app.use("/posts", posts);

// Register route
app.get("/register", (req, res) => {
    const { name = "anonymous" } = req.query; // Default to "anonymous" if name is not provided
    req.session.name = name; // Store the name in session
    console.log(`Registered name: ${req.session.name}`); // Log the session object for debugging
    if(name === "anonymous"){
        req.flash("errors", "you are not registered over here please register first");
    }else{
        req.flash("success", "Congratulations, you got selected!");
    }
    res.redirect("/hello");
});

app.get("/hello", (req, res) => {
        
        const userName = req.session.name; // Default to "Guest" if name is not in session
        // Corrected log statements
        console.log(`Success message: ${res.locals.successmsg}`);
        console.log(`Error message: ${res.locals.errormsg}`);
        // Render the page with flash messages
        res.render("page.ejs", {
            name: userName,
            successmsg: res.locals.successmsg,
            errormsg: res.locals.errormsg,
        });
});


// Port configuration
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}).on("error", (err) => {
    if (err.code === "EADDRINUSE") {
        console.error(`Port ${PORT} is already in use. Please use a different port.`);
    } else {
        console.error("Server error:", err);
    }
});
