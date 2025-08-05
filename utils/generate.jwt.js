const jwt = require('jsonwebtoken');


const generateJWT = (user) => {
    const token = jwt.sign(user, process.env.JWT_SECRET);
    return token;
};

module.exports = generateJWT;