const express = require('express');
const router = express.Router();
const controller = require('../controllers/users.controller');
const authMiddleware = require('../middleware/authMiddleware');
const allawTo = require('../middleware/allawTo');
const upload = require('../middleware/upload.avatar');

router.get('/',authMiddleware, allawTo('admin'),
    controller.getAllUsers)
    .post('/',upload.single('avatar'), authMiddleware, allawTo('admin'),controller.createUser)
    .patch('/:id',upload.single('avatar'), authMiddleware, allawTo('admin'),controller.updateUser)
    .delete('/:id', authMiddleware, allawTo('admin'),controller.deleteUser);
router.get('/:id', authMiddleware, allawTo('admin'), controller.getUser);

module.exports = router;
