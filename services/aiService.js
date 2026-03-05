const { GoogleGenAI } = require('@google/genai');
const FAQ = require('../models/FAQ');

const getAiResponse = async (userMessage) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
        throw new Error("Gemini API key is not configured");
    }

    const ai = new GoogleGenAI({ apiKey });

    // Fetch all FAQs from MongoDB to build the context
    const faqs = await FAQ.find();
    const faqContext = faqs.map(f => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n');

    // Strict Parul University system instruction injected with dynamic FAQs
    const systemInstruction = `You are an AI assistant exclusively for Parul University. You must ONLY answer questions related to Parul University. If a user asks about anything else, politely decline and state that you can only answer questions about Parul University. First, try to answer based on the provided FAQs context. If the answer is not in the FAQs, use your general knowledge to answer, provided it is about Parul University.

Context:
${faqContext ? faqContext : 'No FAQs available currently.'}`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: userMessage,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.2 // Lower temp for more factual, strict answers
            }
        });

        return response.text;
    } catch (err) {
        console.error('Gemini API Error:', err);
        throw err;
    }
};

module.exports = { getAiResponse };
