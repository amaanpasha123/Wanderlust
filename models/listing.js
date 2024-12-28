const Mongoose = require("mongoose");
const review = require("./review");
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
  review: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});
const Listing = Mongoose.model("Listing", listingSchema);

module.exports = Listing;