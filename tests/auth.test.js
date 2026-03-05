const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authController = require('../controllers/authController');
const Admin = require('../models/Admin');

jest.mock('../models/Admin');

describe('Auth Controller Tests', () => {
    let req, res;

    beforeEach(() => {
        req = { body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn()
        };
        jest.clearAllMocks();
    });

    describe('setupAdmin', () => {
        test('should create a new admin successfully', async () => {
            req.body = { username: 'admin1', password: 'password123' };
            Admin.findOne.mockResolvedValue(null);
            Admin.prototype.save = jest.fn().mockResolvedValue({});

            await authController.setupAdmin(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ message: 'Admin created successfully' });
        });

        test('should not create duplicate admin', async () => {
            req.body = { username: 'admin1', password: 'password123' };
            Admin.findOne.mockResolvedValue({ username: 'admin1' });

            await authController.setupAdmin(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Admin already exists' });
        });

        test('should handle errors', async () => {
            req.body = { username: 'admin1', password: 'password123' };
            Admin.findOne.mockRejectedValue(new Error('Database error'));

            await authController.setupAdmin(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('loginAdmin', () => {
        test('should login with valid credentials', async () => {
            const hashedPassword = await bcrypt.hash('testpass123', 10);
            req.body = { username: 'testadmin', password: 'testpass123' };
            Admin.findOne.mockResolvedValue({
                id: '123',
                username: 'testadmin',
                password: hashedPassword
            });

            await authController.loginAdmin(req, res);

            // Wait for async jwt.sign callback
            await new Promise(resolve => setTimeout(resolve, 100));

            expect(res.json).toHaveBeenCalled();
            expect(res.json.mock.calls[0][0]).toHaveProperty('token');
        });

        test('should fail with invalid username', async () => {
            req.body = { username: 'wronguser', password: 'testpass123' };
            Admin.findOne.mockResolvedValue(null);

            await authController.loginAdmin(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid Credentials' });
        });

        test('should fail with invalid password', async () => {
            const hashedPassword = await bcrypt.hash('correctpass', 10);
            req.body = { username: 'testadmin', password: 'wrongpass' };
            Admin.findOne.mockResolvedValue({
                username: 'testadmin',
                password: hashedPassword
            });

            await authController.loginAdmin(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid Credentials' });
        });
    });
});
