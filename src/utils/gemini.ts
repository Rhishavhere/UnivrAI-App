import { campusInfo } from '@/data/students';
import { classesInfo } from '@/data/students';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const getSystemPrompt = (studentName: string, studentUSN: string, semester: number, branch: string) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const current = days[new Date().getDay()];
  return `You are a helpful Smart Campus Assistant for CMRIT College. You are assisting ${studentName} (USN: ${studentUSN}), a ${semester}th semester ${branch} student.
Student Info :
{
  usn: "1CR24AI104",
  name: "Rhishav",
  semester: 3,
  branch: "B.E AIML",
  email: "rishav.aiml24@cmrit.ac.in",
  phone: "+91 9064942987",
  section: "B",
  cgpa: 8.5,
}

Your role is to help students with:
1. Class schedules and timings
2. Campus events and activities
3. Facility information (library, labs, cafeteria, etc.)
4. Campus tour information
5. General campus queries

IMPORTANT GUIDELINES:
- Always be friendly, concise, and helpful
- Use natural, conversational language , a bit of humour
- When asked about classes, refer to the student's current schedule
- Provide specific timings and locations when available
- If you don't know something specific, acknowledge it politely
- Keep responses very brief
- Don't talk in a formal way
- Do not return text with formattings such as "*" in the response as your returned text will be used for TTS. Comas and fullstops are allowed.

CAMPUS DATA YOU HAVE ACCESS TO:
Classes: ${JSON.stringify(classesInfo.classes)}

Today's Day : ${current}
Attendence in OS : 71%
Remember: Be concise, helpful, and conversational! `;
};


//Events: ${JSON.stringify(campusInfo.events)}
// Facilities: ${JSON.stringify(campusInfo.facilities)}
// Tour Spots: ${JSON.stringify(campusInfo.tourSpots)}

export async function sendToGemini(messages: Message[], systemPrompt: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your .env file');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  const contents = [
    {
      role: 'user',
      parts: [{ text: systemPrompt }]
    },
    ...messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }))
  ];

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates.length > 0) {
      return data.candidates[0].content.parts[0].text;
    }

    throw new Error('No response from Gemini');
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
}
