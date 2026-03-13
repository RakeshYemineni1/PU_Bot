const CONFIG = {
  API_BASE: window.location.hostname === 'localhost' 
    ? 'http://localhost:8080/api' 
    : `${window.location.origin}/api`
};

let currentDomain = null;
let domains = [];

const elements = {
  welcomeScreen: document.getElementById('welcomeScreen'),
  chatMessages: document.getElementById('chatMessages'),
  domainGrid: document.getElementById('domainGrid'),
  userInput: document.getElementById('userInput'),
  sendBtn: document.getElementById('sendBtn'),
  menuBtn: document.getElementById('menuBtn')
};

const domainIcons = {
  placements: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line>',
  admissions: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline>',
  courses: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>',
  academics: '<circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>',
  campusLife: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>',
  scholarships: '<line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>',
  aboutUniversity: '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>',
  facilities: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line>'
};

async function loadDomains() {
  try {
    const response = await fetch(`${CONFIG.API_BASE}/domains`);
    const data = await response.json();
    if (data.success) {
      domains = data.domains;
      renderDomains();
    }
  } catch (error) {
    console.error('Error loading domains:', error);
    showError('Unable to load domains. Please refresh the page.');
  }
}

function renderDomains() {
  elements.domainGrid.innerHTML = domains.map(domain => `
    <div class="domain-card" onclick="selectDomain('${domain.id}')">
      <svg class="domain-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        ${domainIcons[domain.id] || domainIcons.courses}
      </svg>
      <h3>${domain.name}</h3>
      <p>${domain.questionCount} questions</p>
    </div>
  `).join('');
}

async function selectDomain(domainId) {
  currentDomain = domainId;
  elements.welcomeScreen.style.display = 'none';
  elements.chatMessages.classList.add('active');
  elements.chatMessages.innerHTML = '';
  elements.menuBtn.classList.add('active');
  
  const domain = domains.find(d => d.id === domainId);
  addBotMessage(`You selected <strong>${domain.name}</strong>. Here are some questions I can answer:`);
  
  try {
    const response = await fetch(`${CONFIG.API_BASE}/questions/${domainId}`);
    const data = await response.json();
    if (data.success && data.questions.length > 0) {
      showQuestions(data.questions);
    } else {
      addBotMessage('No questions available for this domain.');
    }
  } catch (error) {
    console.error('Error loading questions:', error);
    showError('Unable to load questions.');
  }
}

function showQuestions(questions) {
  const questionsHTML = `
    <div class="question-options">
      ${questions.map(q => `
        <button class="question-btn" onclick="selectQuestion('${currentDomain}', ${q.id})">
          ${q.question}
        </button>
      `).join('')}
      <button class="back-btn" onclick="goBack()">← Back to Topics</button>
    </div>
  `;
  
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message bot';
  messageDiv.innerHTML = `
    <div class="message-avatar">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    </div>
    <div class="message-content">${questionsHTML}</div>
  `;
  
  elements.chatMessages.appendChild(messageDiv);
  scrollToBottom();
}

async function selectQuestion(domain, questionId) {
  const questions = Array.from(document.querySelectorAll('.question-btn'));
  const selectedQuestion = questions[questionId]?.textContent;
  if (selectedQuestion) {
    addUserMessage(selectedQuestion);
  }
  showTypingIndicator();
  try {
    const response = await fetch(`${CONFIG.API_BASE}/answer/${domain}/${questionId}`);
    const data = await response.json();
    removeTypingIndicator();
    if (data.success) {
      addBotMessage(data.answer.answer);
    } else {
      addBotMessage('Sorry, I could not find an answer to that question.');
    }
  } catch (error) {
    removeTypingIndicator();
    console.error('Error getting answer:', error);
    showError('Unable to get answer.');
  }
}

async function handleUserInput() {
  const question = elements.userInput.value.trim();
  if (!question) return;
  addUserMessage(question);
  elements.userInput.value = '';
  elements.sendBtn.disabled = true;
  showTypingIndicator();
  try {
    const response = await fetch(`${CONFIG.API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question })
    });
    const data = await response.json();
    removeTypingIndicator();
    elements.sendBtn.disabled = false;
    if (data.success) {
      addBotMessage(data.answer);
    } else {
      showError('Unable to process your question.');
    }
  } catch (error) {
    removeTypingIndicator();
    elements.sendBtn.disabled = false;
    console.error('Error asking question:', error);
    showError('Unable to connect to the server.');
  }
}

function addUserMessage(text) {
  elements.welcomeScreen.style.display = 'none';
  elements.chatMessages.classList.add('active');
  elements.menuBtn.classList.add('active');
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message user';
  messageDiv.innerHTML = `
    <div class="message-content">${escapeHtml(text)}</div>
    <div class="message-avatar">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    </div>
  `;
  elements.chatMessages.appendChild(messageDiv);
  scrollToBottom();
}

function addBotMessage(text) {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message bot';
  messageDiv.innerHTML = `
    <div class="message-avatar">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    </div>
    <div class="message-content">${text}</div>
  `;
  
  elements.chatMessages.appendChild(messageDiv);
  scrollToBottom();
}

function showTypingIndicator() {
  const typingDiv = document.createElement('div');
  typingDiv.className = 'message bot typing-indicator-message';
  typingDiv.innerHTML = `
    <div class="message-avatar">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    </div>
    <div class="message-content">
      <div class="typing-indicator">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    </div>
  `;
  elements.chatMessages.appendChild(typingDiv);
  scrollToBottom();
}

function removeTypingIndicator() {
  const typing = elements.chatMessages.querySelector('.typing-indicator-message');
  if (typing) typing.remove();
}

function showError(message) {
  addBotMessage(`⚠️ ${message}`);
}

function goBack() {
  elements.chatMessages.classList.remove('active');
  elements.chatMessages.innerHTML = '';
  elements.welcomeScreen.style.display = 'flex';
  elements.menuBtn.classList.remove('active');
  currentDomain = null;
}

function goBackToTopics() {
  goBack();
}

function scrollToBottom() {
  elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

elements.sendBtn.addEventListener('click', handleUserInput);
elements.userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') handleUserInput();
});

window.selectDomain = selectDomain;
window.selectQuestion = selectQuestion;
window.goBack = goBack;
window.goBackToTopics = goBackToTopics;

loadDomains();