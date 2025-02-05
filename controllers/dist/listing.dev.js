"use strict";

var Listing = require("../models/listing");

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
};