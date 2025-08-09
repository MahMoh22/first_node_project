const express = require('express');
const router = express.Router();
const controller = require('../controllers/users.controller');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/upload.avatar');


router.get('/', authMiddleware, controller.getProfile);
router.patch('/',upload.single('avatar'), authMiddleware, controller.updateProfile);
router.delete('/', authMiddleware, controller.deleteProfile);
module.exports = router;