const express = require('express');
const router = express.Router();
const controller = require('../controllers/users.controller');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/',authMiddleware, 
    controller.getAllUsers)
    .post('/', controller.createUser)
    .patch('/:id', controller.updateUser)
    .delete('/:id', controller.deleteUser);
router.get('/:id', controller.getUser);

module.exports = router;
