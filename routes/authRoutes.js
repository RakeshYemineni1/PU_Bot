const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Define routes
router.post('/setup', authController.setupAdmin);
router.post('/login', authController.loginAdmin);

module.exports = router;
