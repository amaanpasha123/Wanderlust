const express = require("express");
const bodyParser = require("body-parser"); // To parse request bodies
const app = express();
const users = require("./routes/user");
const posts = require("./routes/posts");


// Middleware
app.use(bodyParser.json()); // Parse JSON bodies



app.use("/users", users);  //here we have defined our common path so that it could reduce the code complexities...
app.use("/posts", posts);  //same as above.....



// Routes
// Home Route
app.get("/", (req, res) => {
    res.send("Hi, I am welcoming you, baby! Aslamalaikum!");
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});


