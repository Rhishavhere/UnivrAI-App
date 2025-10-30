const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// export interface Message {
//   role: 'user' | 'assistant';
//   content: string;
// }

export const getAlertPrompt = (studentName: string, studentUSN: string, semester: number, branch: string) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const current = days[new Date().getDay()];
  return `You are a helpful Smart Alarm System Emergencies and SOS in CMRIT College. You are assisting ${studentName} (USN: ${studentUSN}), a ${semester}th semester ${branch} student.
Return a simple and short alert message understanding the student's situation. 
For Example:
"studentName from 4th semester AIML is currently having a Medical Emergency near Lab201."
Today's Day : ${current}`;
};


//Events: ${JSON.stringify(campusInfo.events)}
// Facilities: ${JSON.stringify(campusInfo.facilities)}
// Tour Spots: ${JSON.stringify(campusInfo.tourSpots)}

export async function sendAlert(message: string, systemPrompt: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your .env file');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  const contents = [
    {
      role: 'user',
      parts: [{ text: systemPrompt }]
    },
    {
      role: 'user',
      parts: [{ text: message }]
    }
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
