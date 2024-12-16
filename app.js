//require dependencies 
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./Models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const blogRouter = require("./routes/blog.js");
const userRouter = require("./routes/user.js");
//app is listening using express
app.listen(8080,()=>{
    console.log("Server is listening to port 8080");
});

//set-up connection with the db using mongoose
main()
    .then(()=>{ 
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

//set path to ejs
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views/"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
// use ejs-locals for all ejs templates:
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

//for using express-session package for req.session object to deal with cookies
const  sessionOptions = {
    secret : "mysupersecretcode",
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 *24 * 60 * 60 * 1000,
        maxAge :  7 *24 * 60 * 60 * 1000
    },
};

//create root route to check connection
// app.get("/",(req,res)=>{
//     console.log("Hi I am root");
//     res.send("Hi I am root");
// });


//use the session function required from express-session package to set attributes of sessionOptions
app.use(session(sessionOptions));
//use the flash
app.use(flash());

//Passport Configurattion
//using passport after session, as we don't want user to have to login again and again in the same session
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

//storing user info in session
passport.serializeUser(User.serializeUser());
//removing user info after session expired
passport.deserializeUser(User.deserializeUser());

//create middleware for using flash if there arives a request for flashing a message to any of the following routes on adding a new listing
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

//demo user route
// app.get("/demouser", async(req,res)=>{
//     let fakeUser = new User({
//         email : "student@gmail.com",
//         username: "deltastudent",
//     });

//     //static method to store fakeUser in db
//     let registeredUser = await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);
// });

app.use("/listings/:id/reviews", reviewRouter);
app.use("/listings/:id/blogs", blogRouter);
app.use("/listings", listingRouter);
app.use("/", userRouter);

//Page not found Standard Respnse
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"PageNotFound"));
});

//Custom Error Hnadling for async errors from database
app.use((err,req,res,next)=>{
    let {statusCode=500, message="Something went wrong!"}= err;
    res.status(statusCode).render("error.ejs",{err});
    // res.status(statusCode).send(message);
});

