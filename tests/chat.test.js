const chatController = require('../controllers/chatController');
const ChatHistory = require('../models/ChatHistory');
const aiService = require('../services/aiService');

jest.mock('../models/ChatHistory');
jest.mock('../services/aiService');

describe('Chat Controller Tests', () => {
    let req, res;

    beforeEach(() => {
        req = { body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        jest.clearAllMocks();
    });

    describe('handleChat', () => {
        test('should handle chat message successfully', async () => {
            req.body = { sessionId: 'session123', message: 'What is Parul University?' };
            aiService.getAiResponse.mockResolvedValue('This is a test AI response');
            ChatHistory.prototype.save = jest.fn().mockResolvedValue({});

            await chatController.handleChat(req, res);

            expect(res.json).toHaveBeenCalledWith({ response: 'This is a test AI response' });
            expect(aiService.getAiResponse).toHaveBeenCalledWith('What is Parul University?');
        });

        test('should fail without sessionId', async () => {
            req.body = { message: 'Test message' };

            await chatController.handleChat(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'sessionId and message are required' });
        });

        test('should fail without message', async () => {
            req.body = { sessionId: 'session123' };

            await chatController.handleChat(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'sessionId and message are required' });
        });

        test('should handle AI service errors', async () => {
            req.body = { sessionId: 'session123', message: 'Test message' };
            aiService.getAiResponse.mockRejectedValue(new Error('AI service error'));

            await chatController.handleChat(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Failed to get AI response' });
        });
    });
});
