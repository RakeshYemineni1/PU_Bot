const FAQ = require('../models/FAQ');

// @route   GET /api/faq
// @desc    Get all FAQs (Publicly accessible for chatbot / frontend)
exports.getFAQs = async (req, res) => {
    try {
        const faqs = await FAQ.find();
        res.json(faqs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   POST /api/faq
// @desc    Add a new FAQ
// @access  Private
exports.addFAQ = async (req, res) => {
    try {
        const { question, answer, category } = req.body;

        const newFAQ = new FAQ({
            question,
            answer,
            category
        });

        const faq = await newFAQ.save();
        res.json(faq);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   PUT /api/faq/:id
// @desc    Update an FAQ
// @access  Private
exports.updateFAQ = async (req, res) => {
    try {
        const { question, answer, category } = req.body;

        // Build FAQ object
        const faqFields = {};
        if (question) faqFields.question = question;
        if (answer) faqFields.answer = answer;
        if (category) faqFields.category = category;

        let faq = await FAQ.findById(req.params.id);
        if (!faq) return res.status(404).json({ message: 'FAQ not found' });

        faq = await FAQ.findByIdAndUpdate(
            req.params.id,
            { $set: faqFields },
            { new: true }
        );

        res.json(faq);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   DELETE /api/faq/:id
// @desc    Delete an FAQ
// @access  Private
exports.deleteFAQ = async (req, res) => {
    try {
        let faq = await FAQ.findById(req.params.id);
        if (!faq) return res.status(404).json({ message: 'FAQ not found' });

        await FAQ.findByIdAndDelete(req.params.id);
        res.json({ message: 'FAQ removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
