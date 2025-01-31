const mongoose = require("mongoose");
const initdata = require("./data.js");

const Listing = require("../models/listing.js");

main().then(() => {
    console.log("Connected to DB");
}).catch(err => {
    console.log("There is an error", err);
});

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/WonderLust");
}

const initdb = async () => {
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj)=>({ ...obj, owner:'6796716ef6427970a442c3d9'}));
    await Listing.insertMany(initdata.data);
    console.log("data was initialized");
}


initdb();