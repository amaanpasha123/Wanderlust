module.exports.isLoggedIn = (req, res, next)=>{
    if(!req.isAuthenticated()){
        req.flash("error", "user is not Authenticated");
        return res.redirect("/login");
    }
};

