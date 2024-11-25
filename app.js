// Dependencies
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("../Major/models/listing"); // Ensure this path is correct
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapsync = require("../Major/utils/wrapAsyc");
const ExpressError = require("../Major/utils/ExpressErrors");
const {listingSchema} = require("../Major/schema.js");
const ReviewsModel = require("../Major/models/review");
const review = require("../Major/models/review");

// Set up EJS engine with ejs-mate
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
// Ensure 'public' directory contains your CSS file

 // Serve static files from 'public'
// Mongoose connection
main().then(() => {
  console.log("Connected to DB");
}).catch(err => {
  console.log("There is an error", err);
});

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/WonderLust");
}

// Server setup
app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});

// Routes
// Index Route - List all listings
app.get('/listings', wrapsync(async (req, res) => {
  try {
    const allListings = await Listing.find({}); // Assuming Listing is your Mongoose model
    res.render('listings/index', { allListings }); // Pass listings to view
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
}));

// New Listing Route
app.get("/listings/new", (req, res) => {
  res.render("listings/new");
});

// Show Listing Route
app.get("/listings/:id", wrapsync(async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).send('Listing not found');
    }
    res.render("listings/show", { listing });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
}));

// Create New Listing Route
app.post("/listings", wrapsync(async (req, res, next) => {
  let result = listingSchema.validate(req.body);
  console.log(result);
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
}));



// Edit Listing Route
app.get("/listings/:id/edit", wrapsync(async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).send('Listing not found');
    }
    res.render("listings/edit", { listing });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
}));

// Update Listing Route
app.put("/listings/:id",wrapsync(async (req, res) => {
  try {
    const updatedListing = await Listing.findByIdAndUpdate(req.params.id, req.body.listing, { new: true });
    res.redirect(`/listings/${req.params.id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating listing');
  }
}));

// Delete Listing Route
app.delete("/listings/:id", wrapsync(async (req, res) => {
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.redirect("/listings");
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting listing');
  }
}));


//Reviews Post Route......
app.post("/listing/:id/reviews",async (req, res) => {
  let listings =  await Listing.findById(req.param.id);
  let newlisting = new review(req.body.review);

  listing.review.push(newlisting);

  await newlisting.save();
  await listing.save();
  console.log("new review saved");
  res.send("this new review is saved");
});



app.get("/listings/:id", wrapsync(async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('reviews');
    if (!listing) {
      return res.status(404).send('Listing not found');
    }
    res.render("listings/show", { listing });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
}));


// Home Route
app.get("/", (req, res) => {
  res.send("We are listening very well, don't worry!");
});

app.all("*",(req, res, next)=>{
    next(new ExpressError (404,"Page not found"));
});

app.use((err, req, res, next)=>{
  let {statuscode=500 , message="something went wrong !!!!!"} = err;
  res.render("error.ejs",{message:"Something went wrong!!!"});
  // res.send(statuscode).send(message);
});
