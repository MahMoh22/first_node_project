const authController = require('../controllers/auth.controller');
const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload.avatar');




router.post( '/register',upload.single('avatar'), authController.register);
router.post('/login', authController.login);

module.exports = router;