const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsyc.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");


// Signup route
router.get("/signup", userController.renderSingupForm);

router.post(
    "/signup",
    wrapAsync(userController.SignUp)
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
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
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





module.exports = router;
