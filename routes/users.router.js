const express = require('express');
const router = express.Router();
const controller = require('../controllers/users.controller');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/upload.avatar');

router.get('/',authMiddleware, 
    controller.getAllUsers)
    .post('/',upload.single('avatar'), controller.createUser)
    .patch('/:id',upload.single('avatar'), controller.updateUser)
    .delete('/:id', controller.deleteUser);
router.get('/:id', controller.getUser);

module.exports = router;
