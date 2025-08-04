const User = require('../models/user.model');
const statusHelper = require('../utils/status.helper');
const asyncWrapper = require('../middleware/asyncWrapper');
const ERRORHelper = require('../utils/error.helper');


const getAllUsers = asyncWrapper( async (req, res) => {
    const query = req.query;
        const limit = query.limit ? parseInt(query.limit) : 10;
        const page = query.page ? parseInt(query.page) : 1;
        const skip = (page - 1) * limit;
    const users = await User.find({},{"__v":false}).limit(limit).skip(skip);
    res.json({
        status: statusHelper.SUCCESS,
        message: 'Users fetched successfully',
        data: {users},
    });
});
const createUser = asyncWrapper( async (req, res) => {
    const user = new User(req.body);
    await user.save();
    res.json({
        status: statusHelper.SUCCESS, 
        message: 'User created successfully',
        data: {user},
    });
});
const updateUser = asyncWrapper( async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body);
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
    const user = await User.findById(req.params.id);
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
module.exports = {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    getUser
}