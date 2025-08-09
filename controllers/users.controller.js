const User = require('../models/User.model');
const statusHelper = require('../utils/status.helper');
const asyncWrapper = require('../middleware/asyncWrapper');
const ERRORHelper = require('../utils/error.helper');
const bcrypt = require('bcryptjs');
const {validateCreateUser, validateUpdateUser} = require('../middleware/validator.middleware');


const getAllUsers = asyncWrapper( async (req, res) => {
    const query = req.query;
        const limit = query.limit ? parseInt(query.limit) : 10;
        const page = query.page ? parseInt(query.page) : 1;
        const skip = (page - 1) * limit;
    const users = await User.find({},{"__v":false,"password":false,"confirmPassword":false,"otp":false,"isVerified":false,"exp":false}).limit(limit).skip(skip);
    res.json({
        status: statusHelper.SUCCESS,
        message: 'Users fetched successfully',
        data: {users},
    });
});
const createUser = asyncWrapper( async (req, res, next) => {
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
    const user = new User({...req.body});
    await user.save();
    res.status(201).json({
        status: statusHelper.SUCCESS, 
        message: 'User created successfully',
        data: {
            "user":{
                _id:user._id,
                email:user.email,
                firstName:user.firstName,
                lastName:user.lastName,
                role:user.role,
                avatar:user.avatar,
                createdAt:user.createdAt,
                updatedAt:user.updatedAt,
                
            }
        },
    });
});
const updateUser = asyncWrapper( async (req, res, next) => {
    const {error} = validateUpdateUser(req.body);
    if (error) {
        const err = ERRORHelper.create(error.details[0].message, 400,statusHelper.FAIL);
        return next(err);
    }
    if (req.body.password) {
        const salt = await bcrypt.genSalt(7);
        req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    if(req.file){
        req.body.avatar = req.file.filename;
    }
    const user = await User.findByIdAndUpdate(
        req.params.id, 
        {...req.body},
        {new: true,select: '-__v -password -otp -isVerified -exp'});
    if (!user) {
        const error = ERRORHelper.create('User not found', 404,statusHelper.FAIL);
        return next(error);
    }
    return res.json({ 
        status: statusHelper.SUCCESS,
        message: 'User updated successfully',
        data: {user},
     });
});
const deleteUser = asyncWrapper( async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
        const error = ERRORHelper.create('User not found', 404,statusHelper.FAIL);
        return next(error);
    }
    return res.json({ 
        status: statusHelper.SUCCESS,
        message: 'User deleted successfully' ,
        data: null,
    });
});
const getUser = asyncWrapper( async (req, res, next) => {
    const id = req.params.id;
    const user = await User.findById(req.params.id,{"__v":false,"password":false,"otp":false,"isVerified":false,"exp":false});
    if (!user) {
        const error = ERRORHelper.create('User not found', 404,statusHelper.FAIL);
        return next(error);
    }
    return res.json({ 
        status: statusHelper.SUCCESS,
        message: 'User fetched successfully',
        data: {user},
     });
});

const getProfile = asyncWrapper( async (req, res, next) => {
    const user = await User.findById(req.id,{"__v":false,"password":false,"otp":false,"isVerified":false,"exp":false});
    if (!user) {
        const error = ERRORHelper.create('User not found', 404,statusHelper.FAIL);
        return next(error);
    }
    return res.json({ 
        status: statusHelper.SUCCESS,
        message: 'User fetched successfully',
        data: {user},
     });
});

const updateProfile = asyncWrapper( async (req, res, next) => {
    const {error} = validateUpdateUser(req.body);
    if (error) {
        const err = ERRORHelper.create(error.details[0].message, 400,statusHelper.FAIL);
        return next(err);
    }
    if(req.body.role){
        if(req.role !== 'admin'){
            const error = ERRORHelper.create('Invalid role', 400,statusHelper.FAIL);
            return next(error);
        }
    }
    if (req.body.password) {
        const salt = await bcrypt.genSalt(7);
        req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    if(req.file){
        req.body.avatar = req.file.filename;
    }
    const user = await User.findByIdAndUpdate(
        req.id, 
            {...req.body},
            {new: true,select: '-__v -password -otp -isVerified -exp'});
    if (!user) {
        const error = ERRORHelper.create('User not found', 404,statusHelper.FAIL);
        return next(error);
    }
    return res.json({ 
        status: statusHelper.SUCCESS,
        message: 'User updated successfully',
        data: {user},
     });
});
const deleteProfile = asyncWrapper(async(req, res, next) => {
    const user = await User.findByIdAndDelete(req.id);
    if (!user) {
        const error = ERRORHelper.create('User not found', 404,statusHelper.FAIL);
        return next(error);
    }
    return res.json({ 
        status: statusHelper.SUCCESS,
        message: 'User deleted successfully' ,
        data: null,
    });
});

module.exports = {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    getUser,
    getProfile,
    updateProfile,
    deleteProfile
}