const mongoose = require("mongoose");
//store mongoose.Schema in a variable to use later
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment : String,
    rating : {
        type :Number,
        min : 1,
        max : 5
    },
    createdAt : {
        type : Date,
        default : Date.now()
    },
    author : {
        type : Schema.Types.ObjectId,
        ref : "User",
    },
});

 
let Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
// listing -> reviews : one to many relation DR