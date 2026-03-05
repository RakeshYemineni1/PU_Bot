const mongoose = require('mongoose');

const knowledgeSchema = new mongoose.Schema({
    url: String,
    title: String,
    content: String,
    category: String,
    scrapedAt: { type: Date, default: Date.now },
    embedding: {
        type: [Number],
        required: false,
        index: true // Optional: could be used for basic indexing, though we'll do in-memory cosine sim for now
    }
});

module.exports = mongoose.model('Knowledge', knowledgeSchema);
