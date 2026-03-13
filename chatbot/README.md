# University Chatbot System

A modular chatbot system for Parul University that uses web scraping to create a JSON knowledge base and provides both navigation-based and AI-powered chat modes.

## Features

- **Web Scraping**: Extracts content from 53 university URLs
- **JSON Knowledge Base**: Structured data without database dependency
- **Navigation Mode**: Click-based domain and question selection
- **AI Chat Mode**: Gemini-powered fallback for free-form questions
- **Professional UI**: Modern, responsive design with SVG icons

## Project Structure

```
chatbot/
├── backend/
│   ├── modules/
│   │   ├── scraper.js          # Web scraper
│   │   ├── gemini.js           # Gemini AI integration
│   │   └── knowledgeLoader.js  # Knowledge base loader
│   ├── knowledge/              # Generated JSON files
│   ├── server.js               # Express API server
│   ├── package.json
│   └── .env
└── frontend/
    ├── css/
    │   └── style.css
    ├── js/
    │   └── app.js
    └── index.html
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Run the Scraper

This will scrape all 53 URLs and generate JSON knowledge files:

```bash
npm run scrape
```

Wait for the scraping to complete. You'll see output like:
```
Scraped 53 pages successfully
Created placements.json with 5 Q&A pairs
Created admissions.json with 5 Q&A pairs
...
```

### 3. Start the Backend Server

```bash
npm start
```

Server will run on `http://localhost:3000`

### 4. Open the Frontend

Open `frontend/index.html` in your browser or use a local server:

```bash
cd frontend
# Using Python
python -m http.server 8080

# Using Node.js
npx serve
```

Then visit `http://localhost:8080`

## Usage

### Navigation Mode
1. Click on any domain card (Placements, Admissions, etc.)
2. Select a question from the list
3. Get instant answers from the JSON knowledge base
4. Click "Back to Topics" to return

### Chat Mode
1. Type any question in the input box at the bottom
2. Press Enter or click the send button
3. Gemini AI will provide an answer

## API Endpoints

- `GET /api/domains` - Get all available domains
- `GET /api/questions/:domain` - Get questions for a domain
- `GET /api/answer/:domain/:questionId` - Get answer for a question
- `POST /api/chat` - Ask Gemini AI a free-form question

## Customization

### Add More URLs
Edit `backend/modules/scraper.js` and add URLs to the `URLS` array.

### Modify Domains
Edit the categorization logic in `categorizeContent()` function in `scraper.js`.

### Change Questions
Modify the `generateQA()` function in `scraper.js` to customize questions per domain.

### Update Styling
Edit `frontend/css/style.css` for UI customization.

## Technologies

- **Backend**: Node.js, Express, Axios, Cheerio
- **AI**: Google Gemini API
- **Frontend**: Vanilla JavaScript, CSS3, HTML5
- **Data**: JSON files (no database)

## Notes

- Run the scraper periodically to update knowledge base
- Gemini API key is stored in `.env` file
- All scraped content is stored in `backend/knowledge/` directory
- The system is fully modular and easy to extend
