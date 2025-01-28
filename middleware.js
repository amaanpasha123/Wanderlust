module.exports.isLoggedIn = (req, res, next)=>{
    console.log(req.user);
    if(!req.isAuthenticated()){
        req.flash("error", "user is not Authenticated");
        return res.redirect("/login");
    }
    next();
};

