"use strict";

var cloudinary = require('cloudinary').v2;

var _require = require('multer-storage-cloudinary'),
    CloudinaryStorage = _require.CloudinaryStorage;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});