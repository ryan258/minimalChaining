// StockInsightAI.js

// First, let's bring in all the tools we need for our stock analysis adventure!
const fs = require('fs').promises;  // This is like a librarian that helps us read and write files
const path = require('path');  // This helps us find our way around folders, like a map
const { askAI } = require('../utils/aiUtils');  // This is our AI friend who will help us analyze stocks
const { getEnvVariable } = require('../utils/envUtils');  // This helps us get secret information
const { log, logError } = require('../utils/loggerUtils');  // These help us write messages to our log book

// We're getting the secret address and name of our AI friend
const API_URL = getEnvVariable('API_URL');  // This is like the phone number for our AI
const MODEL_NAME = getEnvVariable('MODEL_NAME');  // This is the name of our AI friend

// This function is like a time machine that gives us the current date and time
function getCurrentDateTime() {
  return new Date().toISOString().replace(/:/g, '-').split('.')[0];  // We replace ':' with '-' to make it file-name friendly
}

// This function is like a librarian that makes sure we have a place to store our books (logs)
async function ensureLogDirectory(directory) {
  try {
    await fs.mkdir(directory, { recursive: true });  // We're asking our librarian to create a new shelf if it doesn't exist
    log(`📁 Log directory ensured at ${directory}`, '✅');
  } catch (error) {
    logError(`❌ Failed to create log directory: ${error.message}`, error);
    throw error;  // If something goes wrong, we stop everything and tell someone about it
  }
}

// This function is like a wise old stock trader that analyzes a stock for us
async function analyzeStock(symbol) {
  const prompt = `Please analyze the stock ${symbol} and provide insights on its current market position, potential risks, and growth opportunities. Consider factors such as recent news, market trends, and financial health. Give a brief recommendation on whether to buy, hold, or sell.`;
  
  try {
    const analysis = await askAI(API_URL, MODEL_NAME, prompt);  // We're asking our AI friend to analyze the stock
    log(`🧠 AI analysis for ${symbol} completed`, '✅');
    return analysis;
  } catch (error) {
    logError(`❌ Failed to analyze stock ${symbol}: ${error.message}`, error);
    return `Error analyzing stock ${symbol}: ${error.message}`;  // If something goes wrong, we return an error message
  }
}

// This function is like a research assistant that looks up multiple stocks for us
async function researchStocks(symbols) {
  const results = [];
  for (const symbol of symbols) {
    log(`🔍 Analyzing stock: ${symbol}`, '🏃');
    const analysis = await analyzeStock(symbol);
    results.push({ symbol, analysis });
  }
  return results;
}

// This function is like a secretary that writes down all our findings in a neat report
async function generateReport(stocks) {
  const datetime = getCurrentDateTime();
  const reportContent = stocks.map(stock => 
    `Stock Symbol: ${stock.symbol}\n\nAnalysis:\n${stock.analysis}\n\n${'='.repeat(50)}\n\n`
  ).join('');

  const report = `Stock Analysis Report\nGenerated on: ${datetime}\n\n${reportContent}`;
  return report;
}

// This function is like a filing clerk that saves our report in the right folder
async function saveReport(report) {
  const logDirectory = path.join(__dirname, 'logs');  // This is the address of our log folder
  await ensureLogDirectory(logDirectory);  // We make sure our log folder exists

  const filename = `StockAnalysis_${getCurrentDateTime()}.log`;  // We're giving our report a unique name
  const filePath = path.join(logDirectory, filename);

  try {
    await fs.writeFile(filePath, report);  // We're asking our filing clerk to write down our report
    log(`📝 Report saved to ${filePath}`, '✅');
    return filePath;
  } catch (error) {
    logError(`❌ Failed to save report: ${error.message}`, error);
    throw error;  // If something goes wrong, we stop everything and tell someone about it
  }
}

// This is our main function that runs the whole stock analysis show
async function runStockInsightAI() {
  try {
    log("Welcome to StockInsightAI! 📈", "🤖");
    
    // Let's pretend we're analyzing these stocks (you can change these or add more)
    const stockSymbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN'];
    
    log(`Analyzing stocks: ${stockSymbols.join(', ')}`, "🔍");
    const analyzedStocks = await researchStocks(stockSymbols);
    
    log("Generating report...", "📊");
    const report = await generateReport(analyzedStocks);
    
    log("Saving report...", "💾");
    const reportPath = await saveReport(report);
    
    log(`Stock analysis complete! You can find the report at: ${reportPath}`, "🎉");
  } catch (error) {
    logError("Oops! Something went wrong with our stock analysis:", error);
  }
}

// This is where we actually start our program
runStockInsightAI().catch(error => logError("A critical error occurred:", error));

// We're making our stock analysis function available for other parts of our program to use
module.exports = {
  runStockInsightAI
};