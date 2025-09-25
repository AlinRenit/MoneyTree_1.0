// Gemini Pro API utility for chat and text generation
export async function geminiProRequest(prompt: string, apiKey: string, isChat: boolean = false, history: Array<{role: string, content: string}> = []) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  let contents;
  if (isChat && history.length > 0) {
    // Convert history to proper format and add current prompt
    contents = history.map(msg => ({
      role: msg.role === 'model' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));
    contents.push({
      role: 'user',
      parts: [{ text: prompt }]
    });
  } else {
    contents = [{
      role: 'user',
      parts: [{ text: prompt }]
    }];
  }

  const body = {
    contents: contents,
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Gemini API Error Response:', errorText);
    throw new Error(`Gemini Pro API error: ${response.status} ${response.statusText} - ${errorText}`);
  }
  
  const result = await response.json();
  console.log('Gemini API Response:', result);
  return result;
}
