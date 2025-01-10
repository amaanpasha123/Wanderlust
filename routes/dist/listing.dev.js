"use strict";

var express = require("express");

var router = express.Router(); // Fixed: Add parentheses to invoke Router

var wrapAsync = require("../utils/wrapAsyc.js");

var _require = require("../schema"),
    listingSchema = _require.listingSchema; // Removed reviewSchema since it isn't used


var ExpressError = require("../utils/ExpressErrors");

var Listing = require("../models/listing"); // Validation middleware


var validateListing = function validateListing(req, res, next) {
  var _listingSchema$valida = listingSchema.validate(req.body),
      error = _listingSchema$valida.error;

  if (error) {
    var errorMessage = error.details.map(function (el) {
      return el.message;
    }).join(", ");
    next(new ExpressError(400, errorMessage)); // Pass error to the middleware chain
  } else {
    next();
  }
}; // Index Route - List all listings


router.get("/", wrapAsync(function _callee(req, res) {
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
})); // New Listing Form

router.get("/new", function (req, res) {
  res.render("listings/new");
}); // Create New Listing

router.post("/", validateListing, wrapAsync(function _callee2(req, res) {
  var newListing;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          newListing = new Listing(req.body.listing);
          _context2.next = 3;
          return regeneratorRuntime.awrap(newListing.save());

        case 3:
          res.flash("success", "Congratulations you created a new listings");
          res.redirect("/listings/".concat(newListing._id));

        case 5:
        case "end":
          return _context2.stop();
      }
    }
  });
})); // Edit Listing Form

router.get("/:id/edit", wrapAsync(function _callee3(req, res) {
  var listing;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(Listing.findById(req.params.id));

        case 2:
          listing = _context3.sent;

          if (listing) {
            _context3.next = 5;
            break;
          }

          throw new ExpressError(404, "Listing not found");

        case 5:
          res.render("listings/edit", {
            listing: listing
          });

        case 6:
        case "end":
          return _context3.stop();
      }
    }
  });
})); // Update Listing

router.put("/:id", validateListing, wrapAsync(function _callee4(req, res) {
  var updatedListing;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(Listing.findByIdAndUpdate(req.params.id, req.body.listing, {
            "new": true,
            runValidators: true
          }));

        case 2:
          updatedListing = _context4.sent;

          if (updatedListing) {
            _context4.next = 5;
            break;
          }

          throw new ExpressError(404, "Listing not found");

        case 5:
          res.redirect("/listings/".concat(req.params.id));

        case 6:
        case "end":
          return _context4.stop();
      }
    }
  });
})); // Delete Listing

router["delete"]("/:id", wrapAsync(function _callee5(req, res) {
  var deletedListing;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(Listing.findByIdAndDelete(req.params.id));

        case 2:
          deletedListing = _context5.sent;

          if (deletedListing) {
            _context5.next = 5;
            break;
          }

          throw new ExpressError(404, "Listing not found");

        case 5:
          res.redirect("/listings");

        case 6:
        case "end":
          return _context5.stop();
      }
    }
  });
}));
module.exports = router;