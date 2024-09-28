// demos/MultiAgentChainDemo.js

// First, we import all the tools and helpers we need for our AI adventure!
const axios = require('axios');  // Our trusty web page fetcher
const cheerio = require('cheerio');  // Our HTML parsing wizard
const { log, logError } = require('../utils/loggerUtils');  // Our message broadcasters
const { asyncErrorHandler } = require('../utils/errorUtils');  // Our safety net for catching errors
const { getEnvVariable } = require('../utils/envUtils');  // Our secret keeper for environment variables
const { askAI } = require('../utils/aiUtils');  // Our local AI buddy
const { askOpenAI } = require('../utils/openAiUtils');  // Our cloud AI friend

// We're getting the secret ingredients from our magic recipe book (.env file)
const API_URL = getEnvVariable('API_URL');
const MODEL_NAME = getEnvVariable('MODEL_NAME');

// This function is like a super-smart web browser that can read websites
async function localWebScraper(url) {
  try {
    // We're asking axios to fetch the web page for us
    const response = await axios.get(url, { timeout: 5000 });  // We'll wait up to 5 seconds
    // We're using cheerio to understand the web page's structure
    const $ = cheerio.load(response.data);
    // We're getting the text from the body of the page
    let content = $('body').text().trim();
    // If the content is too short, we'll try to get more specific parts of the page
    if (content.length < 100) {
      content = $('main').text().trim() || $('article').text().trim() || $('div').text().trim();
    }
    // If we still don't have enough content, we'll say we failed
    if (content.length < 50) {
      return { success: false, content: "The page doesn't have enough content to analyze." };
    }
    return { success: true, content };
  } catch (error) {
    // If anything goes wrong, we'll explain what happened
    return { success: false, content: `Couldn't scrape the website because: ${error.message}` };
  }
}

// This function is like a helpful editor that cleans up the text we scraped
async function cleanContent(content) {
  const prompt = `Please clean and format the following scraped web content. Remove any irrelevant information, ads, or navigation elements. Focus on the main content of the page. If the content is not in English, please translate it to English. Here's the content:

  ${content}

  Cleaned content:`;

  const cleanedContent = await askAI(API_URL, MODEL_NAME, prompt);
  // If our AI friend couldn't clean the content, we'll return the original
  return cleanedContent.includes("I apologize") ? content : cleanedContent;
}

// This is our first AI agent who knows how to read and clean website content
async function webScraperAgent(url) {
  const maxRetries = 3;  // We'll try up to 3 times to get good content
  for (let i = 0; i < maxRetries; i++) {
    log(`Attempt ${i + 1} to scrape ${url}`, '🕷️');
    const { success, content } = await localWebScraper(url);
    if (success) {
      const cleanedContent = await cleanContent(content);
      if (cleanedContent.length > 100) {  // We want at least 100 characters of good content
        return { success: true, content: cleanedContent };
      }
    }
    if (i < maxRetries - 1) log(`Attempt ${i + 1} failed. Retrying...`, '🔄');
  }
  return { success: false, content: `Failed to scrape valid content from ${url} after ${maxRetries} attempts.` };
}

// This is our AI friend who can summarize text
async function summarizerAgent(text) {
  const prompt = `Please provide a brief summary of the following text in about 2-3 sentences. If the text is unclear or seems to be an error message, please mention that in your summary. Here's the text:

  "${text}"`;
  const response = await askAI(API_URL, MODEL_NAME, prompt);
  return response;
}

// This is our AI friend who can tell if text is happy, sad, or neutral
// We're using OpenAI for this task to showcase multi-AI integration!
async function sentimentAnalyzerAgent(text) {
  const prompt = `Please analyze the sentiment of this text. Categorize it as positive, negative, or neutral, and explain why. If the text is unclear or seems to be an error message, please mention that in your analysis. Here's the text:

  "${text}"`;
  const response = await askOpenAI(prompt);
  return response;
}

// This is our AI friend who can describe charts
async function dataVisualizerAgent(sentiment) {
  const prompt = `Based on this sentiment analysis: "${sentiment}", please describe how a bar chart representing this sentiment would look. Include percentages for positive, negative, and neutral sentiments if possible. If the sentiment analysis is unclear or seems to be based on an error message, please create a chart that represents that uncertainty.`;
  const response = await askAI(API_URL, MODEL_NAME, prompt);
  return response;
}

// This is our main function that coordinates all our AI friends
async function runMultiAgentChain() {
  try {
    // We're saying hello and explaining what we're about to do
    log("Welcome to the Multi-AI Source Chain Demo!", '🎭');
    log("We're going to scrape a website, summarize its content, analyze its sentiment using OpenAI, and describe a visualization.", '🔗');

    // We're choosing a website to read
    const url = 'https://en.wikipedia.org/wiki/Bob%27s_Burgers';
    log(`Step 1: Scraping content from ${url}`, '🕷️');
    
    // We're asking our first AI friend to read and clean the website content
    const { success, content } = await webScraperAgent(url);
    if (success) {
      log(`Successfully scraped and cleaned content: ${content.substring(0, 100)}...`, '📄');
    } else {
      log(`Couldn't scrape the website. Here's what happened: ${content}`, '❌');
      // If we can't scrape the website, we stop here
      return log("Demo stopped due to scraping failure. Please try again or choose a different URL.", '🛑');
    }

    // We're asking our local AI friend to summarize the content
    log("Step 2: Summarizing the content (using local Ollama AI)", '📝');
    const summary = await summarizerAgent(content);
    log(`Summary: ${summary}`, '📚');

    // We're asking our OpenAI friend to analyze the mood of the text
    log("Step 3: Analyzing sentiment of the content (using OpenAI)", '🧐');
    const sentimentResult = await sentimentAnalyzerAgent(summary);
    log(`Sentiment analysis result (OpenAI): ${sentimentResult}`, '😊😐😢');

    // We're asking our local AI friend to describe a chart based on the mood
    log("Step 4: Describing a visualization of the sentiment (using local Ollama AI)", '📊');
    const chartDescription = await dataVisualizerAgent(sentimentResult);
    log(`Chart description: ${chartDescription}`, '🖼️');

    // We're saying goodbye and feeling proud of our AI friends' teamwork!
    log("Multi-AI Source Chain Demo completed successfully!", '🎉');
    log("Our AI agents from different sources worked together to scrape, clean, summarize, analyze, and visualize data.", '🤝');
    
  } catch (error) {
    // Uh-oh! If anything goes wrong, we'll explain what happened
    logError("An error occurred during the Multi-AI Source Chain Demo:", error);
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