const express = require('express');
const router = express.Router();
const controller = require('../controllers/courses.controllers');

router.get('/', 
    controller.getAllCourses)
    .post('/', controller.createCourse)
    .patch('/:id', controller.updateCourse)
    .delete('/:id', controller.deleteCourse);
router.get('/:id', controller.getCourse);

module.exports = router;