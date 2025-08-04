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
        // } catch (error) {
            //     res.status(500).json({
                //         status: statusHelper.ERROR, 
                //         message: error.message,
                //         data: null, 
                //     });
                // }
            }
        ) ;
const createCourse = asyncWrapper( async (req, res) => {
    //try {
        const course = new Course(req.body);
        await course.save();
        
        res.json({
            status: statusHelper.SUCCESS, 
            message: 'Course created successfully',
            data: {course},
        });
    // } catch (error) {
    //     res.status(500).json({ 
    //         status: statusHelper.ERROR,
    //         message: error.message,
    //         data: null,
    //      });
    // }
});
const updateCourse = asyncWrapper( async (req, res, next) => {
    //try {
        const course = await Course.findByIdAndUpdate(req.params.id, req.body);
        if (!course) {
            const error = ERRORHelper.create('Course not found', 404,statusHelper.FAIL);
            return next(error);
            // res.status(404).json({ 
            //     status: statusHelper.FAIL,
            //     message: 'Course not found' ,
            //     data: null,
            // });
        }
        return res.json({ 
            status: statusHelper.SUCCESS,
            message: 'Course updated successfully',
            data: {course},
         });
    // } catch (error) {
    //     return res.status(500).json({ 
    //         status: statusHelper.ERROR,
    //         message: error.message ,
    //         data: null,
    //     });
    // }
});
const deleteCourse = asyncWrapper( async (req, res, next) => {
    //try{
        const course = await Course.findByIdAndDelete(req.params.id);
        if (!course) {
            const error = ERRORHelper.create('Course not found', 404,statusHelper.FAIL);
            return next(error);
            // return res.status(404).json({ 
            //     status: statusHelper.FAIL,
            //     message: 'Course not found' ,
            //     data: null,
            // });
        }
        return res.json({ 
            status: statusHelper.SUCCESS,
            message: 'Course deleted successfully' ,
            data: null,
        });
    // } catch (error) {
    //     return res.status(500).json({ 
    //         status: statusHelper.ERROR,
    //         message: error.message ,
    //         data: null,
    //     });

    // }
});
const getCourse = asyncWrapper( async (req, res, next) => {
    //try {
        const id = req.params.id;
        const course = await Course.findById(req.params.id);
        if (!course) {
            const error = ERRORHelper.create('Course not found', 404,statusHelper.FAIL);
            return next(error);
            // return res.status(404).json({ 
            //     status: statusHelper.FAIL,
            //     message: 'Course not found' ,
            //     data: null,
            // });
        }
        return res.json({
            status: statusHelper.SUCCESS,
            message: 'Course fetched successfully',
            data: {course},
        });
    // } catch (error) {
    //    return res.status(500).json({ 
    //     status: statusHelper.ERROR,
    //     message: error.message ,
    //     data: null,
    // });
    // }
});

module.exports = {
    getAllCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    getCourse
}