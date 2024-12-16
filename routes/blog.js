const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../Models/listing.js");
const Blog = require("../Models/blog.js");
const User = require("../Models/user.js");
const {isLoggedIn, isBlogAuthor, validateBlog} = require("../middleware.js");

//get route for blogs - show.ejs > right side 
router.get('/', wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id)
        .populate({
            path: "blogs",
            populate: {
                path: "blogCreater",
                model: 'User'
            }
        })
        //also render reviews for blog path {the path has changed so the previous render review code does not work for this path anymore}
        .populate({
            path : "reviews",
            populate : {
                path: "author",
                model: 'User'
            }
        })
        .populate("owner","User");
    // const blog = await Blog.findById(req.params.blogId).populate('blogCreater');
    if (!listing) {
        return res.status(404).send('Listing not found');
    }
    res.render('listings/show', { listing });
}));
// Route to render the blog form
router.get('/new',isLoggedIn, async(req, res) => {
    const listing = await Listing.findById(req.params.id);
    res.render('listings/blog', { listing });
});

// router.get('/:blogId', wrapAsync(async (req, res) => {

//     const listing = await Listing.findById(req.params.id)
//         .populate({
//             path: 'blogs',
//             populate: {
//                 path: 'blogCreater',
//                 model: 'User'
//             }
//         })
//         //also render reviews for blog path {the path has changed so the previous render review code does not work for this path anymore}
//         .populate({
//             path : "reviews",
//             populate : {
//                 path: "author",
//                 model: 'User'
//             }
//         })
//         .populate("owner","User");
//     const blog = await Blog.findById(req.params.blogId).populate('blogCreater');
//     if(!listing){
//         req.flash("error","Listing you requested for does not exist!");
//         res.redirect("/listings");
//     }
//     if (!blog) {
//         req.flash("error", "Blog you requested for does not exist!");
//         return res.redirect(`/listings/${listing._id}`);
//     }
//     //render views properly in blog route

//     //render page
//     res.render('listings/show', { listing, selectedBlog: blog });
// }));

//Show route for /blogs/:blogId
// router.get("/:blogId",wrapAsync(async (req,res)=>{
//     let {id}=req.params;
//     const listing = await Listing.findById(id)
//     .populate({
//         path : "reviews",
//         populate : "author",
//     })
//     .populate("owner");
//     if(!listing){
//         req.flash("error","Listing you requested for does not exist!");
//         res.redirect("/listings");
//     }
//     // console.log(listing);
//     res.render("listings/show.ejs", {listing});
// }));


router.get('/:blogId', wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect('/listings');
    }

    // Fetch and populate each blog individually using Promise.all
    const populatedBlogs = await Promise.all(
        listing.blogs.map(async (blogId) => {
            const blog = await Blog.findById(blogId).populate('blogCreater');
            return blog;
        })
    );

    // Replace the blogs array with the populated blogs
    listing.blogs = populatedBlogs;

    const selectedBlog = await Blog.findById(req.params.blogId).populate('blogCreater');

    if (!selectedBlog) {
        req.flash("error", "Blog not found");
        return res.redirect(`/listings/${listing._id}`);
    }

    res.render('listings/show', { listing, selectedBlog });
}));


// Route to handle blog creation
router.post('/',isLoggedIn , validateBlog,  wrapAsync(async(req, res) => {
    const listing = await Listing.findById(req.params.id);
    const newBlog = new Blog(req.body.blog);
    newBlog.blogCreater = req.user._id;
    listing.blogs.push(newBlog);
    await newBlog.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
}));




module.exports = router;