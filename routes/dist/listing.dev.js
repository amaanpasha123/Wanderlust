"use strict";

var express = require("express");

var router = express.Router(); // Fixed: Add parentheses to invoke Router

var wrapAsync = require("../utils/wrapAsyc.js");

var _require = require("../schema"),
    listingSchema = _require.listingSchema; // Removed reviewSchema since it isn't used


var ExpressError = require("../utils/ExpressErrors");

var Listing = require("../models/listing");

var _require2 = require("../middleware.js"),
    isLoggedIn = _require2.isLoggedIn;

var _require3 = require("../middleware.js"),
    ownerCheck = _require3.ownerCheck;

var listingController = require("../controllers/listing.js");

var mongoose = require("mongoose"); // Validation middleware


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


router.get("/", wrapAsync(listingController.index)); // New Listing Form

router.get("/new", isLoggedIn, listingController.renderNewForm); //Show route of listings.........

router.get("/:id", wrapAsync(listingController.showListing)); // Create New Listing

router.post("/", validateListing, wrapAsync(listingController.createListing)); // Edit Listing Form

router.get("/:id/edit", isLoggedIn, wrapAsync(listingController.editExistingListing)); // Update Listing

router.put("/:id", isLoggedIn, ownerCheck, validateListing, wrapAsync(listingController.updationOfListing)); // Delete Listing

router["delete"]("/:id", isLoggedIn, ownerCheck, wrapAsync(function _callee(req, res) {
  var deletedListing;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(Listing.findByIdAndDelete(req.params.id));

        case 2:
          deletedListing = _context.sent;

          if (deletedListing) {
            _context.next = 5;
            break;
          }

          throw new ExpressError(404, "Listing not found");

        case 5:
          req.flash("success", "Listing is deleted");
          res.redirect("/listings");

        case 7:
        case "end":
          return _context.stop();
      }
    }
  });
}));
module.exports = router;