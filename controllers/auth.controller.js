const asyncWrapper = require('../middleware/asyncWrapper');
const User = require('../models/User.model');
const statusHelper = require('../utils/status.helper');
const ERRORHelper = require('../utils/error.helper');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateJWT, generateRefreshJWT } = require('../utils/generate.jwt');   
const {validateCreateUser, validateLogin} = require('../middleware/validator.middleware');


const register = asyncWrapper( async (req, res, next) => {
    const {error} = validateCreateUser(req.body);
    if (error) {
        const err = ERRORHelper.create(error.details[0].message, 400,statusHelper.FAIL);
        return next(err);
    }
    const userExists = await User.findOne({email: req.body.email});
    if (userExists) {
        const error = ERRORHelper.create('User already exists', 400,statusHelper.FAIL);
        return next(error);
    }
    const salt = await bcrypt.genSalt(7);
    req.body.password = await bcrypt.hash(req.body.password, salt);
    if(req.file){
        req.body.avatar = req.file.filename;
    }
    const user = await User.create({...req.body});
    const accessToken = generateJWT(user);
    const refreshToken = generateRefreshJWT(user);
    user.refreshToken = refreshToken;
    await user.save();
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.__v;

    res.status(201).json({
        status: statusHelper.SUCCESS, 
        message: 'User created successfully',
        data: 
        {
            "user":userResponse,
            "accessToken":accessToken,
        },
    });
});

const login = asyncWrapper( async (req, res, next) => {
    const {error} = validateLogin(req.body);
    if (error) {
        const err = ERRORHelper.create(error.details[0].message, 400,statusHelper.FAIL);
        return next(err);
    }
    const { email, password } = req.body;
    const user = await User.findOne({email});
    if (!user) {
        const error = ERRORHelper.create('Invalid credentials', 401,statusHelper.FAIL);
        return next(error);
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        const error = ERRORHelper.create('Invalid credentials', 401,statusHelper.FAIL);
        return next(error);
    }
    const accessToken = generateJWT(user);
    const refreshToken = generateRefreshJWT(user);
    user.refreshToken = refreshToken;
    await user.save();
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.__v;
    res.json({
        status: statusHelper.SUCCESS, 
        message: 'User logged in successfully',
        data: {"user":userResponse,"accessToken":accessToken,},
    });
});

module.exports = {
    register,
    login
}