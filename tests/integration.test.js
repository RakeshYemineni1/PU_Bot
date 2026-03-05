const authController = require('../controllers/authController');
const faqController = require('../controllers/faqController');
const Admin = require('../models/Admin');
const FAQ = require('../models/FAQ');

jest.mock('../models/Admin');
jest.mock('../models/FAQ');

describe('Integration Tests', () => {
    let req, res;

    beforeEach(() => {
        req = { body: {}, params: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn()
        };
        jest.clearAllMocks();
    });

    describe('Admin Authentication Flow', () => {
        test('should complete full admin setup and login flow', async () => {
            // Setup admin
            req.body = { username: 'integrationadmin', password: 'testpass123' };
            Admin.findOne.mockResolvedValueOnce(null);
            Admin.prototype.save = jest.fn().mockResolvedValue({});

            await authController.setupAdmin(req, res);
            expect(res.status).toHaveBeenCalledWith(201);

            // Reset res for login
            res.json.mockClear();
            
            // Login
            const bcrypt = require('bcryptjs');
            const hashedPassword = await bcrypt.hash('testpass123', 10);
            Admin.findOne.mockResolvedValueOnce({
                id: '123',
                username: 'integrationadmin',
                password: hashedPassword
            });

            await authController.loginAdmin(req, res);
            
            // Wait for async jwt.sign callback
            await new Promise(resolve => setTimeout(resolve, 100));
            
            expect(res.json).toHaveBeenCalled();
            expect(res.json.mock.calls[0][0]).toHaveProperty('token');
        });
    });

    describe('FAQ Management Flow', () => {
        test('should create, read, update, and delete FAQ', async () => {
            // Create FAQ
            req.body = {
                question: 'Integration test question?',
                answer: 'Integration test answer',
                category: 'Test'
            };
            const mockFAQ = { _id: '123', ...req.body };
            FAQ.prototype.save = jest.fn().mockResolvedValue(mockFAQ);

            await faqController.addFAQ(req, res);
            expect(res.json).toHaveBeenCalledWith(mockFAQ);

            // Read FAQs
            FAQ.find.mockResolvedValue([mockFAQ]);
            await faqController.getFAQs(req, res);
            expect(res.json).toHaveBeenCalledWith([mockFAQ]);

            // Update FAQ
            req.params.id = '123';
            req.body = { answer: 'Updated answer' };
            FAQ.findById.mockResolvedValue(mockFAQ);
            FAQ.findByIdAndUpdate.mockResolvedValue({ ...mockFAQ, answer: 'Updated answer' });

            await faqController.updateFAQ(req, res);
            expect(res.json).toHaveBeenCalled();

            // Delete FAQ
            FAQ.findById.mockResolvedValue(mockFAQ);
            FAQ.findByIdAndDelete.mockResolvedValue({});

            await faqController.deleteFAQ(req, res);
            expect(res.json).toHaveBeenCalledWith({ message: 'FAQ removed' });
        });
    });

    describe('Multiple FAQs Management', () => {
        test('should handle multiple FAQs correctly', async () => {
            const mockFAQs = [
                { _id: '1', question: 'Q1?', answer: 'A1', category: 'Cat1' },
                { _id: '2', question: 'Q2?', answer: 'A2', category: 'Cat2' },
                { _id: '3', question: 'Q3?', answer: 'A3', category: 'Cat1' }
            ];

            FAQ.find.mockResolvedValue(mockFAQs);

            await faqController.getFAQs(req, res);
            expect(res.json).toHaveBeenCalledWith(mockFAQs);
            expect(res.json.mock.calls[0][0].length).toBe(3);
        });
    });
});
