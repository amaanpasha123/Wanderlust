const User = require("../models/user.js");

module.exports.renderSingupForm =  (req, res) => {
    res.render("users/signup");
};


module.exports.SignUp = async (req, res) => {
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
        
    }



module.exports.renderLoginForm =  (req, res) => {
    res.render("users/login");
}



module.exports.logIn = async (req, res) => {
    req.flash("success", "welcome to with your account");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}







module.exports.logOut = (req, res, next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "you have properly logged out");
        res.redirect("/listings");
    });
}


