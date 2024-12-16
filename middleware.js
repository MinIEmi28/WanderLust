const Listing  = require("./Models/listing.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");
const {reviewSchema} = require("./schema.js");
const { blogSchema } = require('./schema.js');
const Review  = require("./Models/review.js");
const Blog  = require("./Models/blog.js");


module.exports.isLoggedIn = (req,res,next)=>{
    
    if (!req.isAuthenticated()){
        // save information of path you're  trying to redirect to if user is not logged in and middleware jumps to login the page
        //redirect Url
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to proceed");
        return res.redirect("/login");
    }
    next();
};

//passport resets req.session{} when res.redirects to /login, so we save the redirectUrl to locals to which passport doesn't have permit to reset the value
module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    };
    next();
};

//check if currUser is listing owner for authorizatiion
module.exports.isOwner = async(req,res,next)=> {
    let {id}=req.params;
    let listing= await Listing.findById(id);
    if (!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    };
    next();
};


//check if currUser is review author for authorizatiion
module.exports.isReviewAuthor = async(req,res,next)=> {
    let {id, reviewId}=req.params;
    let review= await Review.findById(reviewId);
    if (!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    };
    next();
};

//validate Listing joi middleware
module.exports.validateListing = (req,res, next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};


module.exports.validateReview = (req,res, next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};

//check if currUser is blog author for authorizatiion
module.exports.isBlogAuthor = async(req,res,next)=> {
    let {id, blogId}=req.params;
    let blog= await Blog.findById(blogId);
    if (!blog.blogCreater._id.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the author of this blog");
        return res.redirect(`/listings/${id}`);
    };
    next();
};

module.exports.validateBlog = (req, res, next) => {
    const { error } = blogSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};