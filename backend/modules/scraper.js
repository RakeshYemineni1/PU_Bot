import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const URLS = [
  'https://paruluniversity.ac.in/faculty/agriculture/',
  'https://paruluniversity.ac.in/faculty/applied-sciences/',
  'https://paruluniversity.ac.in/faculty/architecture-and-planning/',
  'https://paruluniversity.ac.in/faculty/ayurveda/',
  'https://paruluniversity.ac.in/faculty/commerce/',
  'https://paruluniversity.ac.in/pid/',
  'https://paruluniversity.ac.in/faculty/engineering-technology/',
  'https://paruluniversity.ac.in/faculty/fine-arts/',
  'https://paruluniversity.ac.in/faculty/homeopathy/',
  'https://paruluniversity.ac.in/faculty/hotel-management-catering/',
  'https://paruluniversity.ac.in/faculty/it-computer-science/',
  'https://paruluniversity.ac.in/faculty/law/',
  'https://paruluniversity.ac.in/faculty/liberal-arts/',
  'https://paruluniversity.ac.in/faculty/library-information-sciences/',
  'https://paruluniversity.ac.in/faculty/management-studies/',
  'https://paruluniversity.ac.in/faculty/medicine/',
  'https://paruluniversity.ac.in/faculty/nursing/',
  'https://paruluniversity.ac.in/faculty/faculty-of-allied-and-healthcare-sciences/',
  'https://paruluniversity.ac.in/faculty/performing-arts/',
  'https://paruluniversity.ac.in/faculty/pharmacy/',
  'https://paruluniversity.ac.in/faculty/physiotherapy/',
  'https://paruluniversity.ac.in/faculty/public-health/',
  'https://paruluniversity.ac.in/faculty/social-work/',
  'https://paruluniversity.ac.in/faculty/faculty-of-education-proposed/',
  'https://paruluniversity.ac.in/about-us/',
  'https://paruluniversity.ac.in/about-us/leadership/',
  'https://paruluniversity.ac.in/about-us/vision-and-mission/',
  'https://paruluniversity.ac.in/about-us/pu-advantage/',
  'https://paruluniversity.ac.in/about-us/recognitions-accreditations-approvals-notifications/',
  'https://paruluniversity.ac.in/about-us/campus/',
  'https://paruluniversity.ac.in/about-us/pu-infrastructure/',
  'https://paruluniversity.ac.in/life-at-pu/',
  'https://paruluniversity.ac.in/educational-events-at-pu/',
  'https://paruluniversity.ac.in/academics/examinations/',
  'https://paruluniversity.ac.in/research-and-development-centre/',
  'https://paruluniversity.ac.in/student-services/',
  'https://paruluniversity.ac.in/academics/student-welfare/',
  'https://paruluniversity.ac.in/academics/pu-libraries/',
  'https://paruluniversity.ac.in/academics/faculties-institutes/',
  'https://paruluniversity.ac.in/program-type/diploma/',
  'https://paruluniversity.ac.in/program-type/bachelors-programs/',
  'https://paruluniversity.ac.in/program-type/masters-programs/',
  'https://paruluniversity.ac.in/program-type/doctoral-post-doctoral-program/',
  'https://paruluniversity.ac.in/admission/',
  'https://paruluniversity.ac.in/admission/how-to-apply/',
  'https://paruluniversity.ac.in/international-admissions/',
  'https://paruluniversity.ac.in/scholarships-at-pu/',
  'https://paruluniversity.ac.in/domestic-students-fees-structure/',
  'https://paruluniversity.ac.in/international-students-fees-structure/',
  'https://paruluniversity.ac.in/living-at-pu/',
  'https://paruluniversity.ac.in/training-placement-cell/',
  'https://paruluniversity.ac.in/our-leading-recruiters/',
  'https://paruluniversity.ac.in/placement-policy/'
];

async function scrapeURL(url) {
  try {
    console.log(`Scraping: ${url}`);
    const response = await axios.get(url, { timeout: 10000 });
    const $ = cheerio.load(response.data);
    
    $('script, style, nav, footer, header').remove();
    
    const title = $('h1').first().text().trim() || $('title').text().trim();
    const content = [];
    
    $('p, h1, h2, h3, h4, li, td, th, div.content, article, section').each((i, elem) => {
      const text = $(elem).text().trim();
      if (text && text.length > 20 && text.length < 1000) {
        content.push(text);
      }
    });
    
    return {
      url,
      title,
      content: [...new Set(content)].join(' ').substring(0, 5000)
    };
  } catch (error) {
    console.error(`Error scraping ${url}:`, error.message);
    return { url, title: '', content: '' };
  }
}

async function categorizeContent(scrapedData) {
  const categories = {
    placements: [],
    admissions: [],
    courses: [],
    academics: [],
    campusLife: [],
    scholarships: [],
    aboutUniversity: [],
    facilities: []
  };
  
  scrapedData.forEach(data => {
    const urlLower = data.url.toLowerCase();
    const contentLower = (data.title + ' ' + data.content).toLowerCase();
    
    if (urlLower.includes('placement') || urlLower.includes('recruiters')) {
      categories.placements.push(data);
    } else if (urlLower.includes('admission') || urlLower.includes('how-to-apply')) {
      categories.admissions.push(data);
    } else if (urlLower.includes('scholarship') || urlLower.includes('fees')) {
      categories.scholarships.push(data);
    } else if (urlLower.includes('program') || urlLower.includes('diploma') || urlLower.includes('bachelors') || urlLower.includes('masters') || urlLower.includes('doctoral') || urlLower.includes('faculty/')) {
      categories.courses.push(data);
    } else if (urlLower.includes('life-at') || urlLower.includes('living') || urlLower.includes('campus') || urlLower.includes('events')) {
      categories.campusLife.push(data);
    } else if (urlLower.includes('academic') || urlLower.includes('examination') || urlLower.includes('research') || urlLower.includes('librar')) {
      categories.academics.push(data);
    } else if (urlLower.includes('student-services') || urlLower.includes('welfare') || urlLower.includes('infrastructure')) {
      categories.facilities.push(data);
    } else if (urlLower.includes('about')) {
      categories.aboutUniversity.push(data);
    } else {
      categories.courses.push(data);
    }
  });
  
  return categories;
}

function generateQA(category, data) {
  const qaMap = {
    placements: [
      { q: 'What is the placement process?', keywords: ['placement', 'process', 'training', 'cell'] },
      { q: 'Which companies recruit from the university?', keywords: ['companies', 'recruiters', 'hiring'] },
      { q: 'What is the placement record?', keywords: ['record', 'percentage', 'statistics'] },
      { q: 'What are the average and highest packages?', keywords: ['package', 'salary', 'ctc'] },
      { q: 'Are internships provided?', keywords: ['internship', 'training', 'industrial'] }
    ],
    admissions: [
      { q: 'How do I apply for admission?', keywords: ['apply', 'application', 'process'] },
      { q: 'What are the eligibility criteria?', keywords: ['eligibility', 'criteria', 'qualification'] },
      { q: 'What is the admission process?', keywords: ['admission', 'process', 'procedure'] },
      { q: 'Is there an entrance exam?', keywords: ['entrance', 'exam', 'test'] },
      { q: 'What documents are required?', keywords: ['documents', 'required', 'certificate'] }
    ],
    courses: [
      { q: 'What courses are offered?', keywords: ['courses', 'programs', 'offered'] },
      { q: 'What are the undergraduate programs?', keywords: ['undergraduate', 'bachelor', 'ug'] },
      { q: 'What are the postgraduate programs?', keywords: ['postgraduate', 'master', 'pg'] },
      { q: 'Are doctoral programs available?', keywords: ['doctoral', 'phd', 'research'] },
      { q: 'What faculties does the university have?', keywords: ['faculty', 'department', 'school'] }
    ],
    academics: [
      { q: 'What is the examination system?', keywords: ['examination', 'exam', 'assessment'] },
      { q: 'What research facilities are available?', keywords: ['research', 'development', 'innovation'] },
      { q: 'What library facilities are provided?', keywords: ['library', 'books', 'resources'] },
      { q: 'What is the academic structure?', keywords: ['academic', 'structure', 'curriculum'] },
      { q: 'What student welfare services exist?', keywords: ['welfare', 'support', 'counseling'] }
    ],
    campusLife: [
      { q: 'What is campus life like?', keywords: ['campus', 'life', 'student'] },
      { q: 'What events are organized?', keywords: ['events', 'fest', 'activities'] },
      { q: 'What are the hostel facilities?', keywords: ['hostel', 'accommodation', 'residence'] },
      { q: 'What sports facilities are available?', keywords: ['sports', 'gym', 'fitness'] },
      { q: 'What clubs and societies exist?', keywords: ['clubs', 'societies', 'organizations'] }
    ],
    scholarships: [
      { q: 'What scholarships are available?', keywords: ['scholarship', 'financial', 'aid'] },
      { q: 'What is the fee structure?', keywords: ['fees', 'fee', 'cost'] },
      { q: 'How can I apply for scholarships?', keywords: ['apply', 'scholarship', 'eligibility'] },
      { q: 'Are there merit-based scholarships?', keywords: ['merit', 'scholarship', 'academic'] },
      { q: 'What is the fee for international students?', keywords: ['international', 'fees', 'foreign'] }
    ],
    aboutUniversity: [
      { q: 'What is the university vision and mission?', keywords: ['vision', 'mission', 'goal'] },
      { q: 'Who are the university leaders?', keywords: ['leadership', 'chancellor', 'vice'] },
      { q: 'What recognitions does the university have?', keywords: ['recognition', 'accreditation', 'approval'] },
      { q: 'What are the university advantages?', keywords: ['advantage', 'benefit', 'unique'] },
      { q: 'Tell me about the university', keywords: ['about', 'university', 'overview'] }
    ],
    facilities: [
      { q: 'What infrastructure does the university have?', keywords: ['infrastructure', 'facilities', 'building'] },
      { q: 'What student services are available?', keywords: ['student', 'services', 'support'] },
      { q: 'What are the campus facilities?', keywords: ['campus', 'facilities', 'amenities'] },
      { q: 'Is there medical support on campus?', keywords: ['medical', 'health', 'hospital'] },
      { q: 'What transport facilities exist?', keywords: ['transport', 'bus', 'connectivity'] }
    ]
  };
  
  const questions = qaMap[category] || [];
  const result = [];
  
  questions.forEach(item => {
    const relevantData = data.filter(d => {
      const text = (d.title + ' ' + d.content).toLowerCase();
      return item.keywords.some(kw => text.includes(kw));
    });
    
    let answer = '';
    
    if (relevantData.length > 0) {
      // Extract and clean the most relevant content
      const combinedContent = relevantData.map(d => d.content).join(' ');
      answer = cleanAndFormatAnswer(combinedContent, item.q, category);
    } else {
      // Fallback to general content
      const generalContent = data[0]?.content || '';
      answer = cleanAndFormatAnswer(generalContent, item.q, category);
    }
    
    result.push({
      question: item.q,
      answer: answer || generateFallbackAnswer(item.q, category),
      sources: relevantData.length > 0 ? relevantData.map(d => d.url).slice(0, 3) : [data[0]?.url].filter(Boolean)
    });
  });
  
  return result;
}

function cleanAndFormatAnswer(rawContent, question, category) {
  if (!rawContent) return '';
  
  // Remove HTML artifacts, navigation elements, and clean text
  let cleaned = rawContent
    .replace(/Home[A-Za-z\s]+/g, '') // Remove navigation
    .replace(/Apply Now|View Brochure|Related Links/g, '') // Remove buttons
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .replace(/\s+/g, ' ') // Multiple spaces to single
    .replace(/[\u00A0\u2000-\u200B\u2028\u2029\u202F\u205F\u3000]/g, ' ') // Unicode spaces
    .trim();
  
  // Extract meaningful sentences based on question type
  const sentences = cleaned.split(/[.!?]+/).filter(s => s.trim().length > 20);
  
  // Generate contextual answer based on category and question
  return generateContextualAnswer(sentences, question, category);
}

function generateContextualAnswer(sentences, question, category) {
  const questionLower = question.toLowerCase();
  
  // Find most relevant sentences
  const relevantSentences = sentences.filter(sentence => {
    const sentenceLower = sentence.toLowerCase();
    
    if (questionLower.includes('vision') || questionLower.includes('mission')) {
      return sentenceLower.includes('vision') || sentenceLower.includes('mission') || 
             sentenceLower.includes('quality') || sentenceLower.includes('learning') ||
             sentenceLower.includes('innovation') || sentenceLower.includes('research');
    }
    
    if (questionLower.includes('placement')) {
      return sentenceLower.includes('placement') || sentenceLower.includes('package') ||
             sentenceLower.includes('recruit') || sentenceLower.includes('company') ||
             sentenceLower.includes('lpa') || sentenceLower.includes('salary');
    }
    
    if (questionLower.includes('admission')) {
      return sentenceLower.includes('admission') || sentenceLower.includes('apply') ||
             sentenceLower.includes('eligibility') || sentenceLower.includes('process');
    }
    
    if (questionLower.includes('courses') || questionLower.includes('programs')) {
      return sentenceLower.includes('program') || sentenceLower.includes('course') ||
             sentenceLower.includes('faculty') || sentenceLower.includes('degree') ||
             sentenceLower.includes('bachelor') || sentenceLower.includes('master');
    }
    
    if (questionLower.includes('scholarship') || questionLower.includes('fee')) {
      return sentenceLower.includes('scholarship') || sentenceLower.includes('fee') ||
             sentenceLower.includes('financial') || sentenceLower.includes('aid');
    }
    
    return sentence.trim().length > 30;
  }).slice(0, 3);
  
  if (relevantSentences.length === 0) {
    return generateFallbackAnswer(question, category);
  }
  
  // Format the answer properly
  let formattedAnswer = relevantSentences.join('. ').trim();
  
  // Ensure proper sentence ending
  if (!formattedAnswer.endsWith('.') && !formattedAnswer.endsWith('!') && !formattedAnswer.endsWith('?')) {
    formattedAnswer += '.';
  }
  
  // Add context-specific formatting
  return addContextualFormatting(formattedAnswer, question, category);
}

function addContextualFormatting(answer, question, category) {
  const questionLower = question.toLowerCase();
  
  if (questionLower.includes('vision') || questionLower.includes('mission')) {
    return `Parul University's vision and mission focus on ${answer.toLowerCase().charAt(0)}${answer.slice(1)}`;
  }
  
  if (questionLower.includes('highest') && questionLower.includes('package')) {
    // Extract package information if available
    const packageMatch = answer.match(/(\d+)\s*(lpa|lac)/i);
    if (packageMatch) {
      return `The highest package offered at Parul University is ${packageMatch[1]} ${packageMatch[2].toUpperCase()}. ${answer}`;
    }
  }
  
  if (questionLower.includes('courses') || questionLower.includes('programs')) {
    return `Parul University offers a wide range of programs including ${answer.toLowerCase()}`;
  }
  
  return answer;
}

function generateFallbackAnswer(question, category) {
  const fallbacks = {
    placements: {
      'What is the placement process?': 'Parul University has a dedicated Training & Placement Cell that facilitates campus placements. The process includes pre-placement training, company visits, and placement drives.',
      'Which companies recruit from the university?': 'Parul University has partnerships with over 2,200+ recruiters from various industries including IT, healthcare, engineering, and management sectors.',
      'What is the placement record?': 'Parul University has successfully placed over 20,000+ students with leading companies across different sectors.',
      'What are the average and highest packages?': 'The highest package offered at Parul University is 60 LPA, with students being placed in top companies like Microsoft.',
      'Are internships provided?': 'Yes, Parul University facilitates internship opportunities through its Training & Placement Cell to provide practical industry experience.'
    },
    admissions: {
      'How do I apply for admission?': 'You can apply for admission to Parul University through the online application process. Visit the official website and fill out the application form.',
      'What are the eligibility criteria?': 'Eligibility criteria vary by program. Generally, candidates need to have completed 12th grade for undergraduate programs and graduation for postgraduate programs.',
      'What is the admission process?': 'The admission process includes application submission, document verification, and merit-based selection or entrance exam as applicable.',
      'Is there an entrance exam?': 'Some programs may require entrance exams like NEET for medical courses. Please check specific program requirements.',
      'What documents are required?': 'Required documents typically include academic transcripts, identity proof, photographs, and program-specific certificates.'
    },
    aboutUniversity: {
      'What is the university vision and mission?': 'Parul University is committed to providing quality education, fostering innovation, and creating a diverse learning environment that prepares students for global challenges.',
      'Who are the university leaders?': 'Parul University is led by experienced academic leaders and administrators committed to educational excellence.',
      'What recognitions does the university have?': 'Parul University has received various recognitions and accreditations for its academic programs and infrastructure.',
      'What are the university advantages?': 'Parul University offers world-class infrastructure, diverse programs, experienced faculty, and strong industry connections.',
      'Tell me about the university': 'Parul University is a leading educational institution known for its quality education, research, and diverse student community from around the world.'
    }
  };
  
  return fallbacks[category]?.[question] || 'For detailed information about this topic, please contact the university directly or visit the official website.';
}

async function main() {
  console.log('Starting scraping process...');
  
  const scrapedData = [];
  for (const url of URLS) {
    const data = await scrapeURL(url);
    if (data.content) scrapedData.push(data);
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log(`Scraped ${scrapedData.length} pages successfully`);
  
  const categorized = await categorizeContent(scrapedData);
  
  const knowledgePath = path.join(__dirname, '../knowledge');
  
  for (const [category, data] of Object.entries(categorized)) {
    if (data.length > 0) {
      const qa = generateQA(category, data);
      const knowledge = {
        domain: category,
        lastUpdated: new Date().toISOString(),
        totalQuestions: qa.length,
        qa: qa
      };
      
      fs.writeFileSync(
        path.join(knowledgePath, `${category}.json`),
        JSON.stringify(knowledge, null, 2)
      );
      console.log(`Created ${category}.json with ${qa.length} Q&A pairs`);
    }
  }
  
  console.log('Scraping and knowledge generation complete!');
}

main();
