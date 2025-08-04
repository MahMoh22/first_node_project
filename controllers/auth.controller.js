const asyncWrapper = require('../middleware/asyncWrapper');
const User = require('../models/user.model');
const statusHelper = require('../utils/status.helper');
const ERRORHelper = require('../utils/error.helper');
const bcrypt = require('bcryptjs');

const register = asyncWrapper( async (req, res, next) => {
    const userExists = await User.findOne({email: req.body.email});
    if (userExists) {
        const error = ERRORHelper.create('User already exists', 400,statusHelper.FAIL);
        return next(error);
    }
    const salt = await bcrypt.genSalt(7);
    req.body.password = await bcrypt.hash(req.body.password, salt);
    const user = await User.create(req.body);
    console.log(user);
    res.status(201).json({
        status: statusHelper.SUCCESS, 
        message: 'User created successfully',
        data: {"user":{
            _id:user._id,
            email:user.email,
            firstName:user.firstName,
            lastName:user.lastName,
        }},
    });
});

const login = asyncWrapper( async (req, res) => {
    res.json({
        status: statusHelper.SUCCESS, 
        message: 'User logged in successfully',
        data: null,
    });
});

module.exports = {
    register,
    login
}