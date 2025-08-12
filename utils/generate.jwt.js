const jwt = require('jsonwebtoken');


const generateJWT = (user) => {
    const token = jwt.sign({id: user._id , email: user.email ,role: user}, process.env.JWT_SECRET, { expiresIn: '1h'});
    return token;
};

const generateRefreshJWT = (user) => {
    const token = jwt.sign({id: user._id , email: user.email ,role: user}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    return token;
};

module.exports = { generateJWT, generateRefreshJWT };