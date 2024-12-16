const mongoose = require("mongoose");
//store mongoose.Schema in a variable to use later
const Schema = mongoose.Schema;
const Review = require("./review.js");

//creating Schema 
const listingSchema = new Schema({
    title : {
        type :String,
        required : true,
    },
    description : String,
    image : {
        type : String,
        default :
        "https://images.app.goo.gl/oMwfut7SSe1GwpyS7",
        set : (v) => 
        v === undefined 
        ? "https://images.app.goo.gl/oMwfut7SSe1GwpyS7"
        : v,
    },
    price : Number,
    location : String,
    country : String,
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review",
        },
   ],
   blogs : [
    {
        type : Schema.Types.ObjectId,
        ref : "Blog",
    },
   ],
   owner : {
        type : Schema.Types.ObjectId,
        ref : "User",
   },
});

//create a middleware to delete reviews related to listings when listings are deleted
listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await Review.deleteMany({_id : {$in : listing.reviews}});
    }
});

//create the model using Scehma created
const Listing = mongoose.model("Listing", listingSchema);

//export Model to app.js
module.exports = Listing;