// Gemini Pro API utility for chat and text generation
export async function geminiProRequest(prompt: string, apiKey: string, isChat: boolean = false, history: Array<{role: string, content: string}> = []) {
  const url = isChat
    ? 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateMessage'
    : 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

  const body = isChat
    ? {
        prompt: {
          messages: history.concat({ role: 'user', content: prompt })
        }
      }
    : {
        contents: [{ role: 'user', parts: [{ text: prompt }] }]
      };

  const response = await fetch(url + `?key=${apiKey}` , {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error('Gemini Pro API error: ' + response.statusText);
  }
  return await response.json();
}
