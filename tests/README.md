# Test Cases Documentation

## Overview
This directory contains comprehensive test cases for the AI HelpDesk ChatBot application.

## Test Files

### 1. auth.test.js
Tests for authentication controller:
- Admin setup (creation)
- Admin login
- Duplicate admin prevention
- Invalid credentials handling

### 2. faq.test.js
Tests for FAQ controller:
- Get all FAQs
- Create new FAQ
- Update existing FAQ
- Delete FAQ
- Error handling for non-existent FAQs

### 3. chat.test.js
Tests for chat controller:
- Handle chat messages
- Save chat history
- Validate required fields
- AI service integration
- Error handling

### 4. aiService.test.js
Tests for AI service:
- API key validation
- FAQ context inclusion
- Empty FAQ handling
- Gemini API integration

### 5. integration.test.js
End-to-end integration tests:
- Complete authentication flow
- Full CRUD operations on FAQs
- Multiple FAQ management

## Running Tests

### Install Dependencies
```bash
npm install
```

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

## Test Coverage
The tests cover:
- Controllers (auth, chat, FAQ)
- Services (AI service)
- Models (Admin, FAQ, ChatHistory)
- Routes integration
- Error handling
- Edge cases

## Environment Setup
Create a `.env.test` file for test environment:
```
MONGODB_URI=mongodb://localhost:27017/test_helpdesk
GEMINI_API_KEY=your_test_api_key
JWT_SECRET=test_jwt_secret
```

## Notes
- Tests use a separate test database
- Mock implementations for external services
- Automatic cleanup after each test
- Comprehensive error scenario coverage
