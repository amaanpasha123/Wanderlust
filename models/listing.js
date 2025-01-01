const Mongoose = require("mongoose");
const Review = require("./review");
const Schema = Mongoose.Schema;

const listingSchema = new Schema({
  title: String,
  description: String,
  image: {
    filename: String,
    url: String, // This will store the actual image URL
  },
  price: {
    type: Number,
  },
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if(listing){
    await Review.deleteMany({_id : {$in: listing.reviews}});
  }
  
});

const Listing = Mongoose.model("Listing", listingSchema);

module.exports = Listing;