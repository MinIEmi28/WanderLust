const Joi = require('joi');
//form validation first step
module.exports.listingSchema = Joi.object({
    listing : Joi.object({
        title: Joi.string().required(),
        description : Joi.string().required(),
        location : Joi.string().required(),
        country : Joi.string().required(),
        price : Joi.number().required().min(0),
        image : Joi.string().allow("",null),
    }).required(),
});

module.exports.reviewSchema = Joi.object({
    review : Joi.object({
        rating : Joi.number().required().min(1).max(5),
        comment : Joi.string().required(),
    }).required(),
});

module.exports.blogSchema = Joi.object({
    blog : Joi.object({
        rating : Joi.number().required().min(1).max(5),
        description : Joi.string().required(),
        amenities : Joi.string().required(),
        convenience : Joi.string().required(),
        checkIn : Joi.string().required(),
        security : Joi.string().required(),
        cancellation : Joi.string().required(),
        pets : Joi.string().required(),
    }).required(),
});