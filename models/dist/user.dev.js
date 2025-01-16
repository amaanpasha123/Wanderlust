"use strict";

var _require = require("joi"),
    types = _require.types,
    required = _require.required;

var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new Schema({
  email: {
    type: String,
    required: true
  }
});
User.plugin(passportLocalMongoose); //by plugin it automatically generate username and hashing password

module.exports = mongoose.model("User", userSchema);