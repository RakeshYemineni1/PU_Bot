const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Test endpoint
router.get('/', (req, res) => {
    res.json({ message: 'Chat API is working. Use POST to send messages.' });
});

// Public route for student chatbot interation
router.post('/', chatController.handleChat);

module.exports = router;
