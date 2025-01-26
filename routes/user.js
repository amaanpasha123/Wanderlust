const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsyc = require("../utils/wrapAsyc");
const passport = require("passport");



router.get("/signup", (req, res) => {
    res.render("users/signup");
});  



router.post("/signup",wrapAsyc( async(req, res)=>{
    try{
        let{username, email, password} = req.body;
    const newuser = new User({email, username});
    const registerUser = await User.register(newuser, password);
    console.log(registerUser);
    req.flash("success","user was registered");
    res.redirect("/listings");
    }
    catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
    
}));

router.get("/login", (req, res)=>{
    res.render("users/login");
});

router.post("/login" ,passport.Authenticator("local", 
    {failureRedirect : "/login",
        failureFlash : true
    }    
), async (req, res)=>{
    res.send("welcome to roomify you are logged in");
});




module.exports = router;