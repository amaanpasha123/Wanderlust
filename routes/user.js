const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsyc.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");


// Signup route
router.get("/signup", userController.renderSingupForm);

//SignUp data is being trasfered over here........
router.post(
    "/signup",
    wrapAsync(userController.SignUp)
);


// Login route
router.get("/login", userController.renderLoginForm);




router.post(
    "/login",
    saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
    userController.logIn
);


router.get("/logout", userController.logOut);



module.exports = router;