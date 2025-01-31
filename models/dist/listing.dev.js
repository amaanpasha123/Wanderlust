"use strict";

var Mongoose = require("mongoose");

var Review = require("./review");

var Schema = Mongoose.Schema;
var listingSchema = new Schema({
  title: String,
  description: String,
  image: {
    filename: String,
    url: String // This will store the actual image URL

  },
  price: {
    type: Number
  },
  location: String,
  country: String,
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: "Review"
  }],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});
listingSchema.post("findOneAndDelete", function _callee(listing) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!listing) {
            _context.next = 3;
            break;
          }

          _context.next = 3;
          return regeneratorRuntime.awrap(Review.deleteMany({
            _id: {
              $in: listing.reviews
            }
          }));

        case 3:
        case "end":
          return _context.stop();
      }
    }
  });
});
var Listing = Mongoose.model("Listing", listingSchema);
module.exports = Listing;