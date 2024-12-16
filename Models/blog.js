const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogSchema = {
    blogCreater : {
        type: Schema.Types.ObjectId,
        ref : "User",
    },
    description :{ 
        type : String,
        required : true,
    },
    amenities : {
        type :String,
        required : true,
    },
    rating : {
        type :Number,
        min : 1,
        max : 5
    },
    convenience : {
        type : String,
        required : true,
    },
    checkIn : {
        type : String,
        required : true,
    },
    security : {
        type : String,
        required : true,
    },
    cancellation : {
        type : String,
        required : true,
    },
    pets : {
        type : String,
        required : true,
    },
};

let Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;