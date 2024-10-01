// utils/openAiUtils.js

const OpenAI = require('openai');
const { getEnvVariable } = require('./envUtils');

/**
 * This function communicates with the OpenAI API and requests a structured response
 * @param {string} prompt - The question or request for the AI
 * @param {z.ZodType} schema - The blueprint for how we want the AI to format its answer
 * @return {Promise<Object>} - A Promise that resolves to the AI's structured response
 */
async function askOpenAI(prompt, schema) {
  const openai = new OpenAI({
    apiKey: getEnvVariable('OPENAI_API_KEY'),
  });

  try {
    const response = await openai.chat.completions.create({
      model: getEnvVariable('OPENAI_MODEL'),
      messages: [
        { 
          role: "system", 
          content: "You are a helpful assistant that always responds in JSON format."
        },
        { 
          role: "user", 
          content: prompt + " Please respond in JSON format."
        }
      ],
      response_format: { type: "json_object" },
    });

    if (!response.choices || response.choices.length === 0) {
      throw new Error('No response from OpenAI');
    }

    const content = response.choices[0].message?.content;
    
    if (!content) {
      throw new Error('No content in OpenAI response');
    }

    const parsedContent = JSON.parse(content);
    return schema.parse(parsedContent);
  } catch (error) {
    console.error("🚨 Oops! Something went wrong when talking to OpenAI:", error);
    throw error;
  }
}

module.exports = {
  askOpenAI
};