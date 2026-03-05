describe('AI Service Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetModules();
    });

    describe('getAiResponse', () => {
        test('should throw error when API key is not configured', async () => {
            const originalKey = process.env.GEMINI_API_KEY;
            process.env.GEMINI_API_KEY = '';

            // Mock FAQ model
            jest.doMock('../models/FAQ', () => ({
                find: jest.fn().mockResolvedValue([])
            }));

            const aiService = require('../services/aiService');
            
            await expect(aiService.getAiResponse('Test message'))
                .rejects.toThrow('Gemini API key is not configured');

            process.env.GEMINI_API_KEY = originalKey;
        });

        test('should call Gemini API with FAQ context', async () => {
            process.env.GEMINI_API_KEY = 'test_key';
            
            // Mock FAQ model
            jest.doMock('../models/FAQ', () => ({
                find: jest.fn().mockResolvedValue([
                    { question: 'What is Parul?', answer: 'A university', category: 'General' }
                ])
            }));

            // Mock GoogleGenAI
            const mockGenerateContent = jest.fn().mockResolvedValue({ text: 'AI response' });
            jest.doMock('@google/genai', () => ({
                GoogleGenAI: jest.fn().mockImplementation(() => ({
                    models: { generateContent: mockGenerateContent }
                }))
            }));

            const aiService = require('../services/aiService');
            const result = await aiService.getAiResponse('Test question');

            expect(result).toBe('AI response');
            expect(mockGenerateContent).toHaveBeenCalled();
        });

        test('should handle API errors gracefully', async () => {
            process.env.GEMINI_API_KEY = 'test_key';
            
            // Mock FAQ model
            jest.doMock('../models/FAQ', () => ({
                find: jest.fn().mockResolvedValue([])
            }));

            // Mock GoogleGenAI to throw error
            jest.doMock('@google/genai', () => ({
                GoogleGenAI: jest.fn().mockImplementation(() => ({
                    models: { 
                        generateContent: jest.fn().mockRejectedValue(new Error('API Error'))
                    }
                }))
            }));

            const aiService = require('../services/aiService');
            
            await expect(aiService.getAiResponse('Test question'))
                .rejects.toThrow('API Error');
        });
    });
});
