const express = require("express");
const router = express.Router();
const User= require("../Models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const Listing = require('../Models/listing.js');
const { isLoggedIn } = require('../middleware'); // Import isLoggedIn middleware
const ExpressError = require("../utils/ExpressError.js");

// Route to render "My Listings" page on root route (/)
router.get('/', isLoggedIn, async (req, res, next) => {
    try {
        // Populate the 'owner' field with the user object
        const listings = await Listing.find({ owner: req.user._id }).populate('owner');
        if (!listings.length) {
            throw new ExpressError(404, 'No listings found for the logged-in user');
        }
        res.render('listings/home', { listings });
    } catch (err) {
        console.error('Error fetching listings:', err);
        next(new ExpressError(500, 'Failed to load listings'));
    }
});

//get route for signup form
router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});

//post route to store info in database
router.post("/signup", wrapAsync(async(req,res)=>{
    try{
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        //registeres - now automatic login
        req.login(registeredUser, (err)=>{
            if(err){
                return next(err);
            };
            req.flash("success","Wecome to wanderlust!");
            res.redirect("/listings");
        });
    
    } catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
    
}));

//login routes
router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});
//login post rooute
router.post("/login",saveRedirectUrl, passport.authenticate("local", {failureRedirect: '/login',failureFlash: true}), async(req,res)=>{
    req.flash("success","Welcome to WanderLust, you are logged in!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
});

//logout routes
router.get("/logout",(req,res, next)=>{
    req.logout((err) => {
        //if passport fails, show error
        if (err){
            return next(err);
        };
        req.flash("success","you are logged out now");
        res.redirect("/listings");
    });
});
module.exports = router;