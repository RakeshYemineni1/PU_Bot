# Parul University Chatbot - Production Ready

## 🎯 Project Overview
A clean, professional chatbot system for Parul University with navigation-based Q&A and AI-powered chat using Google Gemini.

## 📁 Project Structure
```
chatbot/
├── backend/
│   ├── knowledge/          # 8 JSON knowledge domains
│   ├── modules/           # Core modules (scraper, gemini, loader)
│   ├── .env              # Configuration
│   ├── package.json
│   └── server.js         # Express API server
├── frontend/
│   ├── css/style.css     # Clean, minimal styling
│   ├── js/app.js         # Core application logic
│   └── index.html        # Main interface
├── .gitignore
└── README.md
```

## 🚀 Quick Start

### 1. Start Backend
```bash
cd backend
npm start
```
Server runs on: http://localhost:3001

### 2. Start Frontend
```bash
cd frontend
python -m http.server 8080
```
Open: http://localhost:8080

## ✨ Features

### Navigation Mode
- 8 topic domains (4-column grid layout)
- Pre-defined Q&A pairs
- Instant answers from JSON knowledge base
- "Back to Topics" button in chat

### AI Chat Mode
- Google Gemini integration
- Free-form question answering
- Typing indicators
- Smart fallback responses

### UI/UX
- Dark professional theme
- White accent color
- No scrollbar on landing page
- Responsive grid (4/3/2/1 columns)
- Clean navigation with menu button
- ChatGPT-style interface

## 🎨 Design
- **Theme:** Dark navy (#0f1729, #1a1f3a)
- **Accent:** White (#ffffff)
- **Layout:** Centered, no-scroll landing page
- **Grid:** 4 columns (desktop) → 3 (tablet) → 2 (mobile) → 1 (phone)
- **Typography:** Segoe UI, clean and readable

## 🔧 Configuration
- Backend port: 3001 (configurable in .env)
- API endpoints: /api/domains, /api/questions, /api/answer, /api/chat
- Gemini API key in backend/.env

## 📝 Notes
- All code cleaned and optimized
- No unnecessary files or comments
- Production-ready
- Fully responsive
- Cross-browser compatible

## 🎯 Usage
1. Select a topic card → Browse questions → Get answers
2. Type any question → Get AI-powered response
3. Click "Back to Topics" button (top-right) to return to main screen

---
**Status:** ✅ Clean, Optimized, Production-Ready
