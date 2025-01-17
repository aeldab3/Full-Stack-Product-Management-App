const Joi = require("joi")

const userSchema = Joi.object({
    name: Joi.string().pattern(new RegExp('^([a-zA-Z0-9]{3,15})$')).required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')).required(),
    confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
        "any.only": "Password and Confirm Password must match",
    }),
    role: Joi.string().valid("manager", "admin", "user").default("user"),
    phones: Joi.array().items(Joi.string().pattern(new RegExp('^[0-9]{11}$'))).max(2).required()
});

module.exports = userSchema;