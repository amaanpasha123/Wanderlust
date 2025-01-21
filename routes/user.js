const express = require("express");
const router = express.Router();
const User = require("..models/user.js");

router.get("/signup", (req, res) => {
    res.render("users/signup");
});  

router.post("/sigup", async(req, res)=>{
    let{username, id, password} = req.body;

});




module.exports = router;

