"use strict";

var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new Schema({
  email: {
    type: String,
    required: true
  }
});
userSchema.plugin(passportLocalMongoose); //by plugin it automatically generate username and hashing password

module.exports = mongoose.model("User", userSchema);