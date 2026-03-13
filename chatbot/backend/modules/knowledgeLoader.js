import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let knowledgeBase = {};

export function loadKnowledge() {
  const knowledgePath = path.join(__dirname, '../knowledge');
  
  if (!fs.existsSync(knowledgePath)) {
    console.error('Knowledge directory not found. Run scraper first.');
    return {};
  }
  
  const files = fs.readdirSync(knowledgePath).filter(f => f.endsWith('.json'));
  
  files.forEach(file => {
    const domain = file.replace('.json', '');
    const content = JSON.parse(fs.readFileSync(path.join(knowledgePath, file), 'utf-8'));
    knowledgeBase[domain] = content;
  });
  
  console.log(`Loaded ${Object.keys(knowledgeBase).length} knowledge domains`);
  return knowledgeBase;
}

export function getKnowledge() {
  return knowledgeBase;
}

export function getDomains() {
  return Object.keys(knowledgeBase).map(key => ({
    id: key,
    name: formatDomainName(key),
    questionCount: knowledgeBase[key].totalQuestions || 0
  }));
}

export function getQuestions(domain) {
  if (!knowledgeBase[domain]) return [];
  return knowledgeBase[domain].qa.map((item, idx) => ({
    id: idx,
    question: item.question
  }));
}

export function getAnswer(domain, questionId) {
  if (!knowledgeBase[domain] || !knowledgeBase[domain].qa[questionId]) {
    return null;
  }
  return knowledgeBase[domain].qa[questionId];
}

function formatDomainName(key) {
  const names = {
    placements: 'Placements',
    admissions: 'Admissions',
    courses: 'Courses & Programs',
    academics: 'Academics',
    campusLife: 'Campus Life',
    scholarships: 'Scholarships & Fees',
    aboutUniversity: 'About University',
    facilities: 'Facilities & Services'
  };
  return names[key] || key;
}
