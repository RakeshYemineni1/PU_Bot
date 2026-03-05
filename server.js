require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const faqRoutes = require('./routes/faqRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Database connection
const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI || process.env.MONGODB_URI === 'your_mongodb_atlas_connection_string_here') {
            console.warn('⚠️ MONGODB_URI is not set properly. Please update your .env file.');
            return;
        }
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB Atlas');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        process.exit(1);
    }
};

connectDB();

// Routes
app.use('/api/admin', authRoutes);
app.use('/api/faq', faqRoutes);
app.use('/api/chat', chatRoutes);

// Basic route to verify server is running
app.get('/', (req, res) => {
    res.send('College Helpdesk AI Chatbot API is running. Visit <a href="/test.html">/test.html</a> to test.');
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
