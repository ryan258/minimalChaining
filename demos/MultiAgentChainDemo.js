// demos/MultiAgentChainDemo.js

// First, we're inviting all our helper friends to join our project party!
const { enhancedAIAgent } = require('../agents/enhancedAIAgent');
const { useTool } = require('../tools/toolIntegrationFramework');
const { log, logError } = require('../utils/loggerUtils');
const { asyncErrorHandler } = require('../utils/errorUtils');
const { getEnvVariable } = require('../utils/envUtils');
const axios = require('axios');  // This is our new friend who helps us fetch web pages
const cheerio = require('cheerio');  // This is our new friend who helps us read web pages
const { askAI } = require('../utils/aiUtils');  // This is how we talk to our local Ollama AI

// We're getting the secret ingredients from our magic recipe book (.env file)
const API_URL = getEnvVariable('API_URL');
const MODEL_NAME = getEnvVariable('MODEL_NAME');

// This is our new function that knows how to read websites all by itself
async function localWebScraper(url) {
  try {
    // We're using axios to fetch the web page
    const response = await axios.get(url);
    // We're using cheerio to parse the HTML and extract the main content
    const $ = cheerio.load(response.data);
    // We're getting the text from the body of the page
    const content = $('body').text().trim();
    return { success: true, content };
  } catch (error) {
    // If anything goes wrong, we'll explain what happened
    return { success: false, content: `Couldn't scrape the website because: ${error.message}` };
  }
}

// This is our new function that uses our local Ollama AI to clean up the scraped content
async function cleanContent(content) {
  const prompt = `Please clean and format the following scraped web content. Remove any irrelevant information, ads, or navigation elements. Focus on the main content of the page. Here's the content:

  ${content}

  Cleaned content:`;

  const cleanedContent = await askAI(API_URL, MODEL_NAME, prompt);
  return cleanedContent;
}

// This is our first AI friend who knows how to read and clean website content
async function webScraperAgent(url) {
  // We're using our local web scraper to read the website
  const { success, content } = await localWebScraper(url);
  
  if (success) {
    // If we successfully scraped the content, we clean it up
    const cleanedContent = await cleanContent(content);
    return { success: true, content: cleanedContent };
  } else {
    // If we couldn't scrape the website, we return the error message
    return { success: false, content };
  }
}

// This is our AI friend who can summarize text
async function summarizerAgent(text) {
  // We're asking our AI friend to give us a short summary of the text
  const prompt = `Please provide a brief summary of the following text in about 2-3 sentences: "${text}"`;
  const response = await askAI(API_URL, MODEL_NAME, prompt);
  
  return response;
}

// This is our AI friend who can tell if text is happy, sad, or neutral
async function sentimentAnalyzerAgent(text) {
  // We're asking our AI friend to analyze the mood of the text
  const prompt = `Please analyze the sentiment of this text. Categorize it as positive, negative, or neutral, and explain why. Here's the text: "${text}"`;
  const response = await askAI(API_URL, MODEL_NAME, prompt);
  
  return response;
}

// This is our AI friend who can describe charts
async function dataVisualizerAgent(sentiment) {
  // We're asking our AI friend to describe a chart based on the sentiment
  const prompt = `Based on this sentiment analysis: "${sentiment}", please describe how a bar chart representing this sentiment would look. Include percentages for positive, negative, and neutral sentiments if possible.`;
  const response = await askAI(API_URL, MODEL_NAME, prompt);
  
  return response;
}

// This is our main function that coordinates all our AI friends
async function runMultiAgentChain() {
  try {
    // We're saying hello and explaining what we're about to do
    log("Welcome to the Multi-Agent Chain Demo!", '🎭');
    log("We're going to scrape a website, summarize its content, analyze its sentiment, and describe a visualization.", '🔗');

    // We're choosing a website to read
    const url = 'https://example.com';
    log(`Step 1: Scraping content from ${url}`, '🕷️');
    
    // We're asking our first AI friend to read and clean the website content
    const { success, content } = await webScraperAgent(url);
    if (success) {
      log(`Successfully scraped and cleaned content: ${content.substring(0, 100)}...`, '📄');
    } else {
      log(`Couldn't scrape the website. Here's what happened: ${content}`, '❌');
      return;  // If we can't scrape the website, we stop here
    }

    // We're asking our AI friend to summarize the content
    log("Step 2: Summarizing the content", '📝');
    const summary = await summarizerAgent(content);
    log(`Summary: ${summary}`, '📚');

    // We're asking our AI friend to analyze the mood of the text
    log("Step 3: Analyzing sentiment of the content", '🧐');
    const sentimentResult = await sentimentAnalyzerAgent(summary);
    log(`Sentiment analysis result: ${sentimentResult}`, '😊😐😢');

    // We're asking our AI friend to describe a chart based on the mood
    log("Step 4: Describing a visualization of the sentiment", '📊');
    const chartDescription = await dataVisualizerAgent(sentimentResult);
    log(`Chart description: ${chartDescription}`, '🖼️');

    // We're saying goodbye and feeling proud of our AI friends' teamwork!
    log("Multi-Agent Chain Demo completed successfully!", '🎉');
    log("Our AI agents worked together to scrape, clean, summarize, analyze, and visualize data.", '🤝');
    
  } catch (error) {
    // Uh-oh! If anything goes wrong, we'll explain what happened
    logError("An error occurred during the Multi-Agent Chain Demo:", error);
  }
}

// We're creating a safety net for our main function, just in case something goes wrong
const safeRunMultiAgentChain = asyncErrorHandler(runMultiAgentChain);

// This is where we actually start our demo. It's like pressing the "Go" button!
safeRunMultiAgentChain().catch(error => logError("A critical error occurred:", error));

// We're making our demo available for other parts of our program to use
module.exports = {
  runMultiAgentChain
};