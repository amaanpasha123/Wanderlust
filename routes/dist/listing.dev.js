"use strict";

var express = require("express");

var router = express.Router(); // Fixed: Add parentheses to invoke Router

var wrapAsync = require("../utils/wrapAsyc.js");

var _require = require("../schema"),
    listingSchema = _require.listingSchema; // Removed reviewSchema since it isn't used


var ExpressError = require("../utils/ExpressErrors");

var Listing = require("../models/listing");

var _require2 = require("../middleware.js"),
    isLoggedIn = _require2.isLoggedIn; // Validation middleware


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

router.get("/new", isLoggedIn, function (req, res) {
  res.render("listings/new");
}); // // Show route
// router.get(
//     "/:id",
//     wrapAsync(async (req, res) => {
//       let { id } = req.params;
//       const listing = await Listing.findById(id).populate("reviews");
//         if(!listing){
//             req.flash("error","listing you created doesn't exist");
//             res.redirect("/listings");
//         }
//       res.render("./listings/show.ejs", { listing, id});
//     })
//     );

var mongoose = require("mongoose");

router.get("/:id", wrapAsync(function _callee2(req, res) {
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
          return regeneratorRuntime.awrap(Listing.findById(id).populate("reviews"));

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
})); // Create New Listing

router.post("/", validateListing, wrapAsync(function _callee3(req, res) {
  var newListing;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          newListing = new Listing(req.body.listing);
          _context3.next = 3;
          return regeneratorRuntime.awrap(newListing.save());

        case 3:
          req.flash("success", "Congratulations you created a new listings");
          res.redirect("/listings");

        case 5:
        case "end":
          return _context3.stop();
      }
    }
  });
})); // Edit Listing Form

router.get("/:id/edit", isLoggedIn, wrapAsync(function _callee4(req, res) {
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
})); // Update Listing

router.put("/:id", isLoggedIn, validateListing, wrapAsync(function _callee5(req, res) {
  var updatedListing;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(Listing.findByIdAndUpdate(req.params.id, req.body.listing, {
            "new": true,
            runValidators: true
          }));

        case 2:
          updatedListing = _context5.sent;

          if (updatedListing) {
            _context5.next = 5;
            break;
          }

          throw new ExpressError(404, "Listing not found");

        case 5:
          req.flash("success", "you listing is updated");
          res.redirect("/listings/".concat(req.params.id));

        case 7:
        case "end":
          return _context5.stop();
      }
    }
  });
})); // Delete Listing

router["delete"]("/:id", isLoggedIn, wrapAsync(function _callee6(req, res) {
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
}));
module.exports = router;