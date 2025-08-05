const asyncWrapper = require('../middleware/asyncWrapper');
const User = require('../models/user.model');
const statusHelper = require('../utils/status.helper');
const ERRORHelper = require('../utils/error.helper');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = asyncWrapper( async (req, res, next) => {
    const userExists = await User.findOne({email: req.body.email});
    if (userExists) {
        const error = ERRORHelper.create('User already exists', 400,statusHelper.FAIL);
        return next(error);
    }
    const salt = await bcrypt.genSalt(7);
    req.body.password = await bcrypt.hash(req.body.password, salt);
    const token = jwt.sign({ email: req.body.email ,firstName: req.body.firstName, lastName: req.body.lastName,role: req.body.role}, process.env.JWT_SECRET, { expiresIn: '1d' });
    const user = await User.create({...req.body, token});

    res.status(201).json({
        status: statusHelper.SUCCESS, 
        message: 'User created successfully',
        data: {"user":{
            _id:user._id,
            email:user.email,
            firstName:user.firstName,
            lastName:user.lastName,
            token
        }},
    });
});

const login = asyncWrapper( async (req, res, next) => {
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
    const token = jwt.sign({ email: user.email ,firstName: user.firstName, lastName: user.lastName,role: user.role}, process.env.JWT_SECRET, { expiresIn: '1h' });
    user.token = token;
    await user.save();
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.__v;
    res.json({
        status: statusHelper.SUCCESS, 
        message: 'User logged in successfully',
        data: {"user":userResponse},
    });
});

module.exports = {
    register,
    login
}