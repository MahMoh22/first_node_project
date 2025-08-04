const Course = require('../models/Course.model');
const statusHelper = require('../utils/status.helper');
const asyncWrapper = require('../middleware/asyncWrapper');
const ERRORHelper = require('../utils/error.helper');
const getAllCourses = 
asyncWrapper(
    async (req, res) => {
        const query = req.query;
        const limit = query.limit ? parseInt(query.limit) : 10;
        const page = query.page ? parseInt(query.page) : 1;
        const skip = (page - 1) * limit;
        const courses = await Course.find({},{"__v":false}).limit(limit).skip(skip);
        res.json({
            status: statusHelper.SUCCESS,
            message: 'Courses fetched successfully',
            data: {courses},
        });
            }
        ) ;
const createCourse = asyncWrapper( async (req, res) => {
        const course = new Course(req.body);
        await course.save();
        
        res.json({
            status: statusHelper.SUCCESS, 
            message: 'Course created successfully',
            data: {course},
        });
    
});
const updateCourse = asyncWrapper( async (req, res, next) => {
        const course = await Course.findByIdAndUpdate(req.params.id, req.body);
        if (!course) {
            const error = ERRORHelper.create('Course not found', 404,statusHelper.FAIL);
            return next(error);
        }
        return res.json({ 
            status: statusHelper.SUCCESS,
            message: 'Course updated successfully',
            data: {course},
         });
});
const deleteCourse = asyncWrapper( async (req, res, next) => {
        const course = await Course.findByIdAndDelete(req.params.id);
        if (!course) {
            const error = ERRORHelper.create('Course not found', 404,statusHelper.FAIL);
            return next(error);
        }
        return res.json({ 
            status: statusHelper.SUCCESS,
            message: 'Course deleted successfully' ,
            data: null,
        });
});
const getCourse = asyncWrapper( async (req, res, next) => {
        const id = req.params.id;
        const course = await Course.findById(req.params.id);
        if (!course) {
            const error = ERRORHelper.create('Course not found', 404,statusHelper.FAIL);
            return next(error);
        }
        return res.json({
            status: statusHelper.SUCCESS,
            message: 'Course fetched successfully',
            data: {course},
        });
});

module.exports = {
    getAllCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    getCourse
}