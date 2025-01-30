const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsyc.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");


// Signup route
router.get("/signup", (req, res) => {
    res.render("users/signup");
});


router.post(
    "/signup",
    wrapAsync(async (req, res) => {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        // console.log(registeredUser);
        req.login(registeredUser, (err)=>{
            if(err){
                return next(err);
            }
        req.flash("success", "User was registered successfully!");
        res.redirect(req.session.redirectUrl);
        });
        
    })
);


// Login route
router.get("/login", (req, res) => {
    res.render("users/login");
});


router.post(
    "/login",
    saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
    async (req, res) => {
        req.flash("success", "welcome to with your account");
        res.redirect(res.locals.redirectUrl);
    }
);


router.get("/logout", (req, res, next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "you have properly logged out");
        res.redirect("/listings");
    });
});

// req.logout(function (err) {
//     if (err) {
//         return next(err);
//     }
//     req.flash("success", "You have properly logged out");
//     res.redirect("/listings");
// });



module.exports = router;
