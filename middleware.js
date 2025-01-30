module.exports.isLoggedIn = (req, res, next)=>{
    // console.log(req.user);
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "user is not Authenticated");
        return res.redirect("/login");
    }
    next();
};


//now we are saving this url in our locals so that it could be accessible every where
module.exports.saveRedirectUrl = (req, res, next)=>{
    if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

