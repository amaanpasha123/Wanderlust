const express = require("express");
const router = express.Router();



// Index post - List all users
router.get("/", (req, res) => {
    res.send("This is for all the Posts.");
});


// Show post - Get details of a specific user by ID
router.get("/:id", (req, res) => {
    const postsId = req.params.id; // Access the ID parameter
    res.send(`Here we are ok with it. User ID: ${postsId}`);
});


// Create a new post
router.post("/", (req, res) => {
    const posts = req.body; // Access the request body
    res.send(`User created successfully. Details: ${JSON.stringify(posts)}`);
});


// Delete a post
router.delete("/:id", (req, res) => {
    const postsId = req.params.id; // Access the ID parameter
    res.send(`User with ID ${postsId} has been deleted.`);
});


module.exports = router;