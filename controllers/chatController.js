const ChatHistory = require('../models/ChatHistory');
const aiService = require('../services/aiServiceLocalProduction'); // Using Local Transformers DB

// @route   POST /api/chat
// @desc    Receive a message from the user and respond via AI
// @access  Public
exports.handleChat = async (req, res) => {
    try {
        const { sessionId, message, type } = req.body;

        if (!sessionId || !message) {
            return res.status(400).json({ error: 'sessionId and message are required' });
        }

        // Call the AI Service with Session ID and Action Type
        const aiResponse = await aiService.getAiResponse(message, sessionId, type || 'text');

        // Save conversation to ChatHistory
        const history = new ChatHistory({
            sessionId,
            userMessage: message,
            aiResponse: typeof aiResponse === 'object' ? aiResponse.response : aiResponse
        });
        await history.save();

        res.json(aiResponse); // Send the full { response, options } object to the client
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: 'Failed to get AI response: ' + error.message });
    }
};
