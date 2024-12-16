const mongoose = require("mongoose");
//require data.js data 
const initData = require("./data.js");
const Listing = require("../Models/listing.js");

//set-up connection with db
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

//define a function that deletes garbage data and when its done, it inserts data.js in db
const initDB = async () => {
    await Listing.deleteMany({});
    //adds owner property value in all initial data
    initData.data = initData.data.map((obj)=>({...obj, owner : "663742ca14980ebe42dd2198"}));
    await Listing.insertMany(initData.data);
    console.log("Data was innitialized");
}

//call the function to store data in db
initDB();