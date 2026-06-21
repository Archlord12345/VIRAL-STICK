// backend/scripts/testGemini.js – quick sanity check of @google/generative-ai SDK
// Run with: node backend/scripts/testGemini.js

require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

if (!process.env.GEMINI_API_KEY) {
  console.error('⚠️  GEMINI_API_KEY not set in .env');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function main() {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });
    const result = await model.generateContent('Explain the concept of memes in one sentence.');
    const response = await result.response;
    console.log('🟢 Gemini response:', response.text());
  } catch (err) {
    console.error('❌ Error calling Gemini API:', err);
  }
}

main();
