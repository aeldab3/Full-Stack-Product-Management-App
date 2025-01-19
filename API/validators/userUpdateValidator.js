const Joi = require("joi")

const userSchema = Joi.object({
    name: Joi.string().pattern(new RegExp('^([a-zA-Z0-9]{3,15})$')),
    email: Joi.string().email(),
    password: Joi.string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')),
    confirmPassword: Joi.string().valid(Joi.ref("password")).messages({
        "any.only": "Password and Confirm Password must match",
    }),
    role: Joi.string().valid("manager", "admin", "user").default("user"),
    phones: Joi.array().items(Joi.string().pattern(new RegExp('^[0-9]{11}$'))).max(2),
});

module.exports = userSchema;