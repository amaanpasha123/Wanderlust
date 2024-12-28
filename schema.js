const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(), // Fixed typo
        country: Joi.string().required(),
        location: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().uri().allow("", null) // Validates as URL if provided
    }).required()
});

module.exports.reviewSchema = new mongoose.Schema({
    rating: Number,
    comment: String,
});