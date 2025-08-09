const express = require('express');
const router = express.Router();
const controller = require('../controllers/books.controllers');
const authMiddleware = require('../middleware/authMiddleware');
const allawTo = require('../middleware/allawTo');

router.get('/', 
    controller.getAllBooks)
    .post('/', authMiddleware, allawTo('admin'), controller.createBook)
    .patch('/:id', controller.updateBook)
    .delete('/:id', controller.deleteBook);
router.get('/:id', controller.getBook);

module.exports = router;