// toolIntegrationFramework.js

// We're bringing in all our special tool friends to help our AI agent
const webScrapingTool = require('./webScrapingTool');
const fileSystemTool = require('./fileSystemTool');
const nlpTool = require('./nlpTool');
const apiInteractionTool = require('./apiInteractionTool');
const dataVisualizationTool = require('./dataVisualizationTool');

/**
 * This is our toolbox that holds all the special tools for our AI agent
 */
const toolbox = {
  // Web scraping tools
  scrapeWebpage: webScrapingTool.scrapeWebpage,
  
  // File system tools
  readFile: fileSystemTool.readFile,
  writeFile: fileSystemTool.writeFile,
  
  // Natural Language Processing tools
  analyzeSentiment: nlpTool.analyzeSentiment,
  findNamedEntities: nlpTool.findNamedEntities,
  
  // API interaction tools
  makeApiRequest: apiInteractionTool.makeApiRequest,
  makeAuthenticatedApiRequest: apiInteractionTool.makeAuthenticatedApiRequest,
  
  // Data visualization tools
  createBarChart: dataVisualizationTool.createBarChart,
  createPieChart: dataVisualizationTool.createPieChart,
  createLineChart: dataVisualizationTool.createLineChart
};

/**
 * This is our magic function that helps our AI agent use a tool
 * @param {string} toolName - This is the name of the tool our AI agent wants to use
 * @param {...any} args - These are the instructions for how to use the tool
 * @return {Promise<any>} - This is the magic spell (Promise) that will give us the result of using the tool
 */
async function useTool(toolName, ...args) {
  // We're checking if we have the tool our AI agent asked for
  if (toolName in toolbox) {
    try {
      // If we have the tool, we're letting our AI agent use it
      return await toolbox[toolName](...args);
    } catch (error) {
      // Uh-oh! If something goes wrong while using the tool, we'll let our AI agent know
      console.error(`Oops! Something went wrong while using the ${toolName} tool:`, error.message);
      return `I couldn't use the ${toolName} tool because: ${error.message}`;
    }
  } else {
    // If we don't have the tool, we'll let our AI agent know
    return `I'm sorry, but I don't have a tool called ${toolName} in my toolbox.`;
  }
}

// We're making our tool-using function available for our AI agent to use
module.exports = {
  useTool
};