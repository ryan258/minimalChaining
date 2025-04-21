// demos/MoviePlotChain.js

// Import necessary modules and utilities
const { callOllama } = require('../utils/aiUtils');
const { getEnvVariable } = require('../utils/envUtils');
const { writeTimestampedFile } = require('../utils/fileUtils');
const path = require('path');

// Set your desired local model here
const MODEL_NAME = 'llama3.1:latest'; // or any other local model you wish to use

// Helper function to log messages both to console and to a string
function logMessage(message) {
  console.log(message);
  return message + '\n';
}

// Function to generate a movie plot based on a prompt
async function generatePlot(prompt) {
  return callOllama(`Generate a short movie plot based on this prompt: "${prompt}". Include a title, synopsis, and list of main characters.`, {}, MODEL_NAME);
}

// Function to extract characters from the plot
async function extractCharacters(plot) {
  const split = plot.split('Main Characters:');
  if (split.length < 2) {
    // Could not find the section, return empty array or handle gracefully
    return [];
  }
  const charactersSection = split[1];
  if (!charactersSection) return [];
  const characters = charactersSection
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.match(/^\d+\.\s*\*\*(.*?)\*\*/))
    .map(line => {
      const match = line.match(/^\d+\.\s*\*\*(.*?)\*\*:\s*(.*)/);
      if (!match) return null;
      const [, name, description] = match;
      return { name: name.trim(), description: description.trim() };
    })
    .filter(Boolean);
  return characters;
}

// Function to analyze characters based on their descriptions in the plot
async function analyzeCharacters(characters) {
  return characters.map(character => {
    return `\n${character.name}:\nPersonality and Role: ${character.description}\n`;
  });
}

// Function to classify the genre of the movie based on the plot
async function classifyGenre(synopsis) {
  return callOllama(`Classify the primary genre and any secondary genres for this movie synopsis: "${synopsis}"`, {}, MODEL_NAME);
}

// Function to analyze the sentiment of the movie plot
async function analyzeSentiment(synopsis) {
  return callOllama(`Analyze the overall sentiment (positive, negative, or neutral) of this movie synopsis and explain why: "${synopsis}"`, {}, MODEL_NAME);
}

// Function to visualize the plot structure
async function visualizePlotStructure(synopsis) {
  return callOllama(`Describe the plot structure (exposition, rising action, climax, falling action, resolution) for this movie synopsis: "${synopsis}"`, {}, MODEL_NAME);
}

// Main function to run the movie plot chain
async function runMoviePlotChain(userPrompt) {
  let logContent = '';

  try {
    logContent += logMessage("Welcome to the Movie Plot Generator and Analyzer! \n");

    // Generate the plot
    logContent += logMessage("Generating movie plot...");
    const plot = await generatePlot(userPrompt);
    logContent += logMessage(plot);

    // Extract and analyze characters
    logContent += logMessage("\nExtracting characters...");
    const characters = await extractCharacters(plot);
    logContent += logMessage(`Extracted characters: ${JSON.stringify(characters.map(c => c.name))}`);

    if (characters.length > 0) {
      logContent += logMessage("\nAnalyzing characters...");
      const characterAnalyses = await analyzeCharacters(characters);
      characterAnalyses.forEach(analysis => {
        logContent += logMessage(analysis);
      });
    } else {
      logContent += logMessage("\nNo main characters found to analyze.");
    }

    // Classify the genre
    logContent += logMessage("\nClassifying genre...");
    const genre = await classifyGenre(plot);
    logContent += logMessage(genre);

    // Analyze the sentiment
    logContent += logMessage("\nAnalyzing sentiment...");
    const sentiment = await analyzeSentiment(plot);
    logContent += logMessage(sentiment);

    // Visualize the plot structure
    logContent += logMessage("\nVisualizing plot structure...");
    const plotStructure = await visualizePlotStructure(plot);
    logContent += logMessage(plotStructure);

    logContent += logMessage("\nMovie Plot Generation and Analysis complete!");

    // Save the log content to a file
    const logsDir = path.join(__dirname, 'logs');
    const { filePath } = writeTimestampedFile('movie_plot_analysis', logContent, logsDir);
    console.log(`Log file saved at: ${filePath}`);

  } catch (error) {
    console.error("An error occurred:", error);
    logContent += `\nError occurred: ${error.message}\n`;
    
    // Save error log
    const logsDir = path.join(__dirname, 'logs');
    const { filePath } = writeTimestampedFile('movie_plot_analysis_error', logContent, logsDir);
    console.log(`Error log saved at: ${filePath}`);
  }
}

// Define the user prompt and run the movie plot chain
const userPrompt = "A time-traveling ghost who must haunt their way through history to save the future";
runMoviePlotChain(userPrompt);