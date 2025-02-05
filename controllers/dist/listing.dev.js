"use strict";

var Listing = require("../models/listing");

var mongoose = require("mongoose");

module.exports.index = function _callee(req, res) {
  var allListings;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(Listing.find({}));

        case 2:
          allListings = _context.sent;
          res.render("listings/index", {
            allListings: allListings
          });

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
}; //rendering new form of listings.....


module.exports.renderNewForm = function (req, res) {
  res.render("listings/new");
}; //showing a single and particular listing over here...


module.exports.showListing = function _callee2(req, res) {
  var id, listing;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          id = req.params.id;

          if (mongoose.Types.ObjectId.isValid(id)) {
            _context2.next = 4;
            break;
          }

          req.flash("error", "Invalid listing ID");
          return _context2.abrupt("return", res.redirect("/listings"));

        case 4:
          _context2.next = 6;
          return regeneratorRuntime.awrap(Listing.findById(id).populate({
            path: "reviews",
            populate: {
              path: "author"
            }
          }).populate("owner"));

        case 6:
          listing = _context2.sent;

          if (listing) {
            _context2.next = 10;
            break;
          }

          req.flash("error", "Listing not found");
          return _context2.abrupt("return", res.redirect("/listings"));

        case 10:
          res.render("./listings/show.ejs", {
            listing: listing
          });

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  });
}; //Create new listing it means it is a post route


module.exports.createListing = function _callee3(req, res) {
  var newListing;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          newListing = new Listing(req.body.listing);
          newListing.owner = req.user._id;
          _context3.next = 4;
          return regeneratorRuntime.awrap(newListing.save());

        case 4:
          req.flash("success", "Congratulations you created a new listings");
          res.redirect("/listings");

        case 6:
        case "end":
          return _context3.stop();
      }
    }
  });
}; //Edit Exiting listings in listings.js this gives the form of listing


module.exports.editExistingListing = function _callee4(req, res) {
  var listing;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(Listing.findById(req.params.id));

        case 2:
          listing = _context4.sent;

          if (listing) {
            _context4.next = 5;
            break;
          }

          throw new ExpressError(404, "Listing not found");

        case 5:
          res.render("listings/edit", {
            listing: listing
          });

        case 6:
        case "end":
          return _context4.stop();
      }
    }
  });
}; //Updation of listing... here we does and actuall updation in listing....


module.exports.updationOfListing = function _callee5(req, res) {
  var id, listing, updatedListing;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          id = req.params.id;
          _context5.next = 3;
          return regeneratorRuntime.awrap(Listing.findById(id));

        case 3:
          listing = _context5.sent;
          _context5.next = 6;
          return regeneratorRuntime.awrap(Listing.findByIdAndUpdate(id, req.body.listing, {
            "new": true,
            runValidators: true
          }));

        case 6:
          updatedListing = _context5.sent;
          req.flash("success", "Your listing has been updated!");
          res.redirect("/listings/".concat(id));

        case 9:
        case "end":
          return _context5.stop();
      }
    }
  });
}; //Deletion of listings........


module.exports.deletionOfListing = function _callee6(req, res) {
  var deletedListing;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return regeneratorRuntime.awrap(Listing.findByIdAndDelete(req.params.id));

        case 2:
          deletedListing = _context6.sent;

          if (deletedListing) {
            _context6.next = 5;
            break;
          }

          throw new ExpressError(404, "Listing not found");

        case 5:
          req.flash("success", "Listing is deleted");
          res.redirect("/listings");

        case 7:
        case "end":
          return _context6.stop();
      }
    }
  });
};