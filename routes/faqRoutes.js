const express = require('express');
const router = express.Router();
const faqController = require('../controllers/faqController');
const auth = require('../middleware/auth');

// Public route
router.get('/', faqController.getFAQs);

// Protected Admin routes
router.post('/', auth, faqController.addFAQ);
router.put('/:id', auth, faqController.updateFAQ);
router.delete('/:id', auth, faqController.deleteFAQ);

module.exports = router;
