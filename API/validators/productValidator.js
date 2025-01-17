const Joi = require("joi");

const productSchema = Joi.object({
    name: Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9\\s]{3,30}$')),
    price: Joi.number().required().min(1),
    quantity: Joi.number().required().min(0),
    imageUrl: Joi.string(),
    catId: Joi.number().required(),
    description: Joi.string().max(200),
});

module.exports = productSchema;