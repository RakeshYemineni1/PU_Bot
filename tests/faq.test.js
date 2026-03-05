const faqController = require('../controllers/faqController');
const FAQ = require('../models/FAQ');

jest.mock('../models/FAQ');

describe('FAQ Controller Tests', () => {
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

    describe('getFAQs', () => {
        test('should return all FAQs', async () => {
            const mockFAQs = [
                { question: 'Q1?', answer: 'A1', category: 'General' },
                { question: 'Q2?', answer: 'A2', category: 'Location' }
            ];
            FAQ.find.mockResolvedValue(mockFAQs);

            await faqController.getFAQs(req, res);

            expect(res.json).toHaveBeenCalledWith(mockFAQs);
        });

        test('should return empty array when no FAQs exist', async () => {
            FAQ.find.mockResolvedValue([]);

            await faqController.getFAQs(req, res);

            expect(res.json).toHaveBeenCalledWith([]);
        });
    });

    describe('addFAQ', () => {
        test('should create a new FAQ', async () => {
            req.body = {
                question: 'What courses are offered?',
                answer: 'Engineering, Medical, Management',
                category: 'Academics'
            };
            const mockFAQ = { _id: '123', ...req.body };
            FAQ.prototype.save = jest.fn().mockResolvedValue(mockFAQ);

            await faqController.addFAQ(req, res);

            expect(res.json).toHaveBeenCalledWith(mockFAQ);
        });
    });

    describe('updateFAQ', () => {
        test('should update an existing FAQ', async () => {
            req.params.id = '123';
            req.body = { answer: 'Updated answer' };
            const mockFAQ = { _id: '123', question: 'Q?', answer: 'Updated answer' };
            FAQ.findById.mockResolvedValue({ _id: '123' });
            FAQ.findByIdAndUpdate.mockResolvedValue(mockFAQ);

            await faqController.updateFAQ(req, res);

            expect(res.json).toHaveBeenCalledWith(mockFAQ);
        });

        test('should return 404 for non-existent FAQ', async () => {
            req.params.id = '999';
            FAQ.findById.mockResolvedValue(null);

            await faqController.updateFAQ(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'FAQ not found' });
        });
    });

    describe('deleteFAQ', () => {
        test('should delete an existing FAQ', async () => {
            req.params.id = '123';
            FAQ.findById.mockResolvedValue({ _id: '123' });
            FAQ.findByIdAndDelete.mockResolvedValue({});

            await faqController.deleteFAQ(req, res);

            expect(res.json).toHaveBeenCalledWith({ message: 'FAQ removed' });
        });

        test('should return 404 for non-existent FAQ', async () => {
            req.params.id = '999';
            FAQ.findById.mockResolvedValue(null);

            await faqController.deleteFAQ(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'FAQ not found' });
        });
    });
});
