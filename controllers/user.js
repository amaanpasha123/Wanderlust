
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


    