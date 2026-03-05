const fs = require('fs');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const faqsPath = path.join(__dirname, '../data/faqs.json');

// In-memory session store for tracking conversation state
const sessions = {};

const getMainMenu = () => {
    // Read dynamically on every load to pick up hot updates
    const faqsData = JSON.parse(fs.readFileSync(faqsPath, 'utf8'));
    return {
        response: "Welcome to Parul University Helpdesk! How can I assist you today?",
        options: faqsData.domains.map((d, index) => ({
            label: d.name,
            value: `DOMAIN_${index}`
        }))
    };
};

const handleGeminiQuery = async (userMessage) => {
    try {
        const prompt = `User Question: ${userMessage}`;
        const result = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: "You are the official Parul University Helpdesk AI. Answer the User Question accurately based on general knowledge about Parul University. DO NOT hallucinate. Keep it extremely concise without emojis. ALWAYS append the following string to the absolute end of your response: '\n\nFor more info, contact: +91-2668-260300 or email info@paruluniversity.ac.in'",
                temperature: 0.1,
            }
        });

        let answerText = result.text.trim();
        return {
            response: answerText,
            options: [{ label: "Back to Main Menu", value: "MENU" }]
        };
    } catch (e) {
        console.error("Gemini Error:", e);
        return {
            response: "Sorry, I am having trouble connecting to my knowledge base right now.",
            options: [{ label: "Return to Menu", value: "MENU" }]
        };
    }
};

// The main service function used by the chatController
const getAiResponse = async (userMessage, sessionId, type) => {
    try {
        if (!sessionId) sessionId = 'default-session';
        const msg = (userMessage || '').trim();

        // 1. Textbox Override -> Instant Gemini Bypass
        if (type === 'text' && msg.toLowerCase() !== 'menu' && msg.toLowerCase() !== 'hi') {
            return await handleGeminiQuery(msg);
        }

        // 2. Initialize Session / Reset
        if (!sessions[sessionId] || msg === 'MENU' || msg.toLowerCase() === 'menu' || msg.toLowerCase() === 'hi') {
            sessions[sessionId] = { state: 'MENU' };
            return getMainMenu();
        }

        // 3. Button Click Handling
        if (type === 'button') {
            const faqsData = JSON.parse(fs.readFileSync(faqsPath, 'utf8'));
            // Picked a Domain
            if (msg.startsWith('DOMAIN_')) {
                const domainIndex = parseInt(msg.split('_')[1]);
                const domain = faqsData.domains[domainIndex];

                if (domain) {
                    sessions[sessionId] = { state: 'SUBMENU', domainIndex };
                    return {
                        response: `You selected ${domain.name} - What specific question do you have?`,
                        options: [
                            ...domain.questions.map((q, qIndex) => ({
                                label: q.query,
                                value: `FAQ_${domainIndex}_${qIndex}`
                            })),
                            { label: "Back to Main Menu", value: "MENU" }
                        ]
                    };
                }
            }

            // Picked a Specific FAQ
            if (msg.startsWith('FAQ_')) {
                const parts = msg.split('_');
                const domainIndex = parseInt(parts[1]);
                const qIndex = parseInt(parts[2]);

                const domain = faqsData.domains[domainIndex];
                if (domain && domain.questions[qIndex]) {
                    const question = domain.questions[qIndex];
                    return {
                        response: question.answer,
                        options: [{ label: "Back to Main Menu", value: "MENU" }]
                    };
                }
            }

            // Fallback for weird button payloads
            return getMainMenu();
        }

        // Catch-all
        return getMainMenu();

    } catch (error) {
        console.error('Error in Rule-Based Chatbot:', error);
        return {
            response: `Sorry, an internal error occurred. Please try again.`,
            options: [{ label: "Restart Menu", value: "MENU" }]
        };
    }
};

module.exports = {
    getAiResponse
};
