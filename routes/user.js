const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/signup", (req, res) => {
    res.render("users/signup");
});  

router.post("/sigup", async(req, res)=>{
    let{username, id, password} = req.body;
    const newuser = new User({email, username});
    const registerUser = await User.register(newuser, password);
    console.log(registerUser);
    req.flash("success","user was registered");
    res.redirect("/listings");
});




module.exports = router;

