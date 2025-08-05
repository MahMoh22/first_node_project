const express = require('express');
const router = express.Router();
const controller = require('../controllers/courses.controllers');
const authMiddleware = require('../middleware/authMiddleware');
const allawTo = require('../middleware/allawTo');

router.get('/', 
    controller.getAllCourses)
    .post('/', authMiddleware, allawTo('admin'), controller.createCourse)
    .patch('/:id', controller.updateCourse)
    .delete('/:id', controller.deleteCourse);
router.get('/:id', controller.getCourse);

module.exports = router;