import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function askGemini(question, context = '') {
  try {
    // Try Gemini API first
    const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-flash' });
    
    const prompt = `You are a chatbot exclusively for Parul University. You ONLY answer questions related to Parul University or general university/education topics (admissions, courses, placements, campus life, fees, scholarships, faculty, facilities, etc.).

If the question is NOT related to Parul University or education/university topics, respond with exactly:
"Thank you for reaching out. I am specifically designed to assist with queries related to Parul University, including admissions, courses, placements, campus life, scholarships, and other university-related matters. I regret that I am unable to assist with your current query.

For further assistance, please feel free to contact us through the following channels:

Email: info@paruluniversity.ac.in
Phone: +91-2668-260300
Website: https://paruluniversity.ac.in/contact-us/
Address: Parul University, P.O. Limda, Ta. Waghodia, Vadodara - 391760, Gujarat, India

Our team will be happy to assist you."

Context: ${context}

Question: ${question}

Answer concisely and professionally:`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    // Fallback to smart keyword-based responses
    const responses = {
      'placement': 'Parul University has excellent placement records with the highest package of 60 LPA. Over 20,000+ students have been placed with 2,200+ recruiters including Microsoft.',
      'admission': 'To apply for admission, visit the official website and fill the online application form. Eligibility varies by program - typically 12th grade for UG and graduation for PG programs.',
      'course': 'Parul University offers programs across 24+ faculties including Engineering, Medicine, Management, Law, Agriculture, and many more at diploma, UG, PG, and doctoral levels.',
      'fee': 'The university offers various scholarships including Cultural, Sports, and Defence scholarships. Fee structure varies by program with separate rates for domestic and international students.',
      'campus': 'Campus life is vibrant with students from 75+ countries. The university provides excellent infrastructure, hostels, sports facilities, and numerous clubs and societies.',
      'vision': 'Parul University\'s vision is to be "A Place for Discovery, Innovation and Quality Learning" providing world-class education in a multicultural environment.',
      'faculty': 'The university has 24+ faculties including Engineering, Medicine, Pharmacy, Law, Management, Agriculture, Arts, Science, and many specialized departments.',
      'infrastructure': 'Parul University boasts world-class infrastructure with modern labs, libraries, sports complexes, hostels, and state-of-the-art facilities.',
      'international': 'The university welcomes over 5,500+ international students from 75+ countries, creating a truly global learning environment.',
      'research': 'The university has dedicated Research & Development centres with advanced facilities supporting innovation across various disciplines.'
    };
    
    const questionLower = question.toLowerCase();
    
    // Check for keyword matches
    for (const [key, response] of Object.entries(responses)) {
      if (questionLower.includes(key)) {
        return response;
      }
    }
    
    // Default helpful response
    return `Thank you for your question about Parul University! 

For detailed information, please explore the navigation cards above:

• **Placements** - 60 LPA highest package, top recruiters
• **Admissions** - Application process and eligibility
• **Courses** - 24+ faculties and programs
• **Academics** - Research facilities and examination system
• **Campus Life** - Events, hostels, and activities
• **Scholarships** - Financial aid and fee structure
• **About University** - Vision, mission, and leadership
• **Facilities** - Infrastructure and student services

Each section contains comprehensive answers to help you!`;
  }
}
