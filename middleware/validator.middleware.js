
const joi = require('joi');
function validateCreateUser(data) {
    const schema = joi.object({
        firstName: joi.string().required().trim().min(3).max(20),
        lastName: joi.string().required().trim().min(3).max(20),
        email: joi.string().email().required().trim(),
        password: joi.string().min(8).required().trim(),
        role: joi.string().valid('user', 'admin').default('user'),
        avatar: joi.string().default('profile.png'),
    });
    return schema.validate(data);
}

function validateUpdateUser(data) {
    const schema = joi.object({
        firstName: joi.string().trim().min(3).max(20),
        lastName: joi.string().trim().min(3).max(20),
        email: joi.string().email().trim(),
        password: joi.string().min(8).trim(),
        role: joi.string().valid('user', 'admin').default('user'),
        avatar: joi.string().default('profile.png'),
    });
    return schema.validate(data);
}

function validateLogin(data) {
    const schema = joi.object({
        email: joi.string().email().required().trim(),
        password: joi.string().min(8).required().trim(),
    });
    return schema.validate(data);
}

module.exports = {
    validateCreateUser,
    validateUpdateUser,
    validateLogin
}