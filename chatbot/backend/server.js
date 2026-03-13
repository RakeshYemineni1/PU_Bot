import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadKnowledge, getDomains, getQuestions, getAnswer } from './modules/knowledgeLoader.js';
import { askGemini } from './modules/gemini.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));
loadKnowledge();

app.get('/api/domains', (req, res) => {
  const domains = getDomains();
  res.json({ success: true, domains });
});

app.get('/api/questions/:domain', (req, res) => {
  const { domain } = req.params;
  const questions = getQuestions(domain);
  res.json({ success: true, questions });
});

app.get('/api/answer/:domain/:questionId', (req, res) => {
  const { domain, questionId } = req.params;
  const answer = getAnswer(domain, parseInt(questionId));
  if (!answer) {
    return res.status(404).json({ success: false, message: 'Answer not found' });
  }
  res.json({ success: true, answer });
});

app.post('/api/chat', async (req, res) => {
  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ success: false, message: 'Question is required' });
  }
  try {
    const answer = await askGemini(question, 'Parul University information');
    res.json({ success: true, answer });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error processing request' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});