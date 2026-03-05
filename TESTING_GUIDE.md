# Backend Testing Guide

## Quick Start

### 1. Start the Server
```bash
node server.js
```

### 2. Open Test Interface
Open in browser: http://localhost:5000/test.html

---

## Test Interface Features

### 💬 Chat Testing
- Enter session ID (any string)
- Type message and click "Send Message"
- See bot responses in real-time

### 📋 FAQ Management
- Add new FAQs with question, answer, category
- Test FAQ creation endpoint

### 📚 View FAQs
- Click "Load FAQs" to see all FAQs in database
- Verify FAQ structure

### 🔐 Admin Login
- Test admin authentication
- Get JWT token for protected routes

---

## API Endpoints (for Frontend Team)

### Chat
```
POST /api/chat
Body: { "sessionId": "string", "message": "string" }
Response: { "response": "string" }
```

### Get FAQs
```
GET /api/faq
Response: [{ "question": "string", "answer": "string", "category": "string" }]
```

### Add FAQ
```
POST /api/faq
Body: { "question": "string", "answer": "string", "category": "string" }
Response: { FAQ object }
```

### Update FAQ
```
PUT /api/faq/:id
Body: { "question": "string", "answer": "string", "category": "string" }
Response: { Updated FAQ object }
```

### Delete FAQ
```
DELETE /api/faq/:id
Response: { "message": "FAQ removed" }
```

### Admin Login
```
POST /api/admin/login
Body: { "username": "string", "password": "string" }
Response: { "token": "JWT_TOKEN" }
```

### Admin Setup (One-time)
```
POST /api/admin/setup
Body: { "username": "string", "password": "string" }
Response: { "message": "Admin created successfully" }
```

---

## Testing Scenarios

### 1. Test Chat Flow
- Ask: "What is Parul University?"
- Ask: "Where is it located?"
- Ask: "What courses are offered?"

### 2. Test FAQ CRUD
- Create FAQ
- View all FAQs
- Update FAQ (use Postman/curl)
- Delete FAQ (use Postman/curl)

### 3. Test Admin Auth
- Create admin (first time)
- Login with credentials
- Use token for protected routes

---

## Sample Test Data

### Create Admin
```json
{
  "username": "admin",
  "password": "admin123"
}
```

### Sample FAQ
```json
{
  "question": "What is the admission process?",
  "answer": "Visit website, fill form, submit documents, pay fee",
  "category": "Admissions"
}
```

### Sample Chat
```json
{
  "sessionId": "user123",
  "message": "Tell me about Parul University"
}
```

---

## Notes for Frontend Team

1. **CORS is enabled** - Can call from any origin
2. **All responses are JSON**
3. **Error format**: `{ "error": "message" }` or `{ "message": "error" }`
4. **Success format**: Varies by endpoint (see above)
5. **Chat is stateless** - Use sessionId to track conversations
6. **No authentication required** for chat and viewing FAQs
7. **Authentication required** for FAQ management (add/update/delete)

---

## Troubleshooting

### Server won't start
- Check if port 5000 is available
- Verify MongoDB connection string in .env

### Chat not responding
- Check Gemini API key in .env
- Verify API quota (5 requests/minute free tier)

### FAQs not loading
- Ensure MongoDB is connected
- Run `node populateFAQs.js` to add sample data

---

## Production Checklist

- [ ] Add rate limiting
- [ ] Implement proper error handling
- [ ] Add request validation
- [ ] Set up logging
- [ ] Configure environment variables
- [ ] Add API documentation (Swagger)
- [ ] Set up monitoring
- [ ] Configure HTTPS
- [ ] Add backup strategy
- [ ] Implement caching
