// agents/enhancedAIAgent.js

const { askAI } = require('../utils/aiUtils');
const { useTool } = require('../tools/toolIntegrationFramework');

/**
 * This is our super-smart AI agent that can use tools!
 * @param {string} prompt - This is the question or task for our AI agent
 * @return {Promise<string>} - This is the magic spell (Promise) that will give us our AI agent's response
 */
async function enhancedAIAgent(prompt) {
  try {
    // First, we're asking our AI friend to think about the prompt
    let response = await askAI(process.env.API_URL, process.env.MODEL_NAME, prompt);
    
    // We're checking if our AI friend wants to use a tool
    if (response.includes('USE_TOOL:')) {
      // If our AI friend wants to use a tool, we're helping it do that
      const toolInstructions = response.split('USE_TOOL:')[1].trim();
      const [toolName, ...args] = toolInstructions.split(' ');
      
      // We're using the tool and getting the result
      const toolResult = await useTool(toolName, ...args);
      
      // We're asking our AI friend to think about the result from using the tool
      response = await askAI(process.env.API_URL, process.env.MODEL_NAME, 
        `Here's the result of using the ${toolName} tool: ${toolResult}\n\nBased on this, ${prompt}`);
    }
    
    // We're returning our AI friend's final thoughts
    return response;
  } catch (error) {
    // Uh-oh! If something goes wrong, we'll let everyone know
    console.error('Oops! Something went wrong with our AI agent:', error.message);
    return `I encountered an error: ${error.message}`;
  }
}

// We're making our super-smart AI agent available for other parts of our program to use
module.exports = {
  enhancedAIAgent
};