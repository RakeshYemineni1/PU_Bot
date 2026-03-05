const mongoose = require('mongoose');

const chatHistorySchema = new mongoose.Schema({
    sessionId: {
        type: String,
        required: true,
        index: true // For faster lookups by student session
    },
    userMessage: {
        type: String,
        required: true
    },
    aiResponse: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('ChatHistory', chatHistorySchema);
