const express = require("express");
const router = express.Router();


// Index users - List all users
router.get("/", (req, res) => {
    res.send("This is for all the users.");
});

// Show user - Get details of a specific user by ID
router.get("/:id", (req, res) => {
    const userId = req.params.id; // Access the ID parameter
    res.send(`Here we are ok with it. User ID: ${userId}`);
});

// Create a new user
router.post("/", (req, res) => {
    const user = req.body; // Access the request body
    res.send(`User created successfully. Details: ${JSON.stringify(user)}`);
});

// Delete a user
router.delete("/:id", (req, res) => {
    const userId = req.params.id; // Access the ID parameter
    res.send(`User with ID ${userId} has been deleted.`);
});


module.exports = router;

