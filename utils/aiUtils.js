// utils/aiUtils.js

const fetch = require('node-fetch');

/**
 * Sends a prompt to the AI model and returns the response.
 * @param {string} apiUrl - The URL of the AI API.
 * @param {string} modelName - The name of the AI model to use.
 * @param {string} prompt - The prompt to send to the AI.
 * @returns {Promise<string>} The AI's response.
 */
async function askAI(apiUrl, modelName, prompt) {
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
    throw error;
  }
}

module.exports = {
  askAI
};