// utils/openAiUtils.js

const fetch = require('node-fetch');
const { getEnvVariable } = require('./envUtils');
const { z } = require('zod');

/**
 * This is our magical function that talks to the OpenAI robot brain and asks for a structured response
 * @param {string} prompt - This is our question or request for the AI
 * @param {z.ZodType} schema - This is like a blueprint for how we want the AI to format its answer
 * @return {Promise<Object>} - This is the magic spell (Promise) that will give us the AI's structured response
 */
async function askOpenAI(prompt, schema) {
  const apiKey = getEnvVariable('OPENAI_API_KEY');
  const modelName = getEnvVariable('OPENAI_MODEL');
  const apiUrl = 'https://api.openai.com/v1/chat/completions';

  // We add the word 'json' to the prompt to satisfy the API requirement
  const jsonPrompt = `${prompt}\n\nPlease provide your response in JSON format.`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: modelName,
        messages: [{ 
          role: "user", 
          content: jsonPrompt
        }],
        temperature: 0.7,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}\n${errorBody}`);
    }

    const data = await response.json();
    
    let content;
    try {
      content = JSON.parse(data.choices[0].message.content);
    } catch (error) {
      console.error("Failed to parse OpenAI response as JSON:", data.choices[0].message.content);
      throw new Error("OpenAI response was not valid JSON");
    }
    
    try {
      return schema.parse(content);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("OpenAI response did not match expected schema:", content);
        console.error("Schema validation errors:", error.errors);
      }
      throw error;
    }
  } catch (error) {
    console.error("🚨 Oops! Something went wrong when talking to OpenAI:", error);
    throw error;
  }
}

module.exports = {
  askOpenAI
};