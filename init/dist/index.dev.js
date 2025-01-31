"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var mongoose = require("mongoose");

var initdata = require("./data.js");

var Listing = require("../models/listing.js");

main().then(function () {
  console.log("Connected to DB");
})["catch"](function (err) {
  console.log("There is an error", err);
});

function main() {
  return regeneratorRuntime.async(function main$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(mongoose.connect("mongodb://127.0.0.1:27017/WonderLust"));

        case 2:
        case "end":
          return _context.stop();
      }
    }
  });
}

var initdb = function initdb() {
  return regeneratorRuntime.async(function initdb$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(Listing.deleteMany({}));

        case 2:
          initdata.data = initdata.data.map(function (obj) {
            return _objectSpread({}, obj, {
              owner: '6796716ef6427970a442c3d9'
            });
          });
          _context2.next = 5;
          return regeneratorRuntime.awrap(Listing.insertMany(initdata.data));

        case 5:
          console.log("data was initialized");

        case 6:
        case "end":
          return _context2.stop();
      }
    }
  });
};

initdb();