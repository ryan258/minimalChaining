// utils/aiUtils.js

/**
 * Sends a prompt to the AI model and returns the response.
 * @param {string} apiUrl - The URL of the AI API.
 * @param {string} modelName - The name of the AI model to use.
 * @param {string} prompt - The prompt to send to the AI.
 * @returns {Promise<string>} The AI's response.
 */
export async function askAI(apiUrl, modelName, prompt) {
  const fetch = (await import('node-fetch')).default;
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelName,
        prompt: prompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("🙈 Oops! Couldn't talk to our AI friend:", error);
    return "The magical AI is taking a nap. Let's try again later!";
  }
}

async function callOllama(prompt, schema, model) {
  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, prompt }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  let result = '';
  const stream = response.body;

  // Node.js: Read the stream line by line
  for await (const chunk of stream) {
    const lines = chunk.toString('utf8').split('\n');
    for (const line of lines) {
      if (line.trim()) {
        try {
          const json = JSON.parse(line);
          if (json.response) result += json.response;
        } catch (e) {
          // Ignore lines that are not valid JSON
        }
      }
    }
  }

  return result.trim();
}

export { callOllama };