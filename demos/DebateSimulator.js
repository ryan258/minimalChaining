// demos/DebateSimulator.js

const MinimalChainable = require('../MinimalChainable');
const { askAI } = require('../utils/aiUtils');
const { writeTimestampedFile } = require('../utils/fileUtils');
const { log, logError } = require('../utils/loggerUtils');
const { asyncErrorHandler } = require('../utils/errorUtils');
const { getEnvVariable } = require('../utils/envUtils');
const { replacePlaceholders } = require('../utils/stringUtils');
const path = require('path');

const API_URL = getEnvVariable('API_URL');
const MODEL_NAME = getEnvVariable('MODEL_NAME');

async function runDebate(topic) {
  log(`Welcome to the AI Debate Simulator! Today's topic: "${topic}"`, '🎭');

  const context = {
    topic: topic,
    sideA: "Proponent",
    sideB: "Opponent",
    fullDebate: "" // We'll use this to keep track of the entire debate
  };

  const prompts = [
    "Introduce the debate topic '{{topic}}' in a neutral manner. Keep it concise, under 100 words.",
    "As the {{sideA}}, present a clear and concise opening statement on '{{topic}}'. Address the key reasons for your position in about 150 words.",
    "As the {{sideB}}, deliver a focused opening statement on '{{topic}}'. Outline your main objections in approximately 150 words.",
    "As the {{sideA}}, present your first main argument. Provide specific evidence or examples. (150 words)",
    "As the {{sideB}}, directly address and rebut the {{sideA}}'s first argument. Focus on the specific points they raised. (150 words)",
    "As the {{sideB}}, present your first main argument, ensuring it's distinct from your opening statement. Provide unique evidence. (150 words)",
    "As the {{sideA}}, directly rebut the {{sideB}}'s first argument. Address their specific points and evidence. (150 words)",
    "As the {{sideA}}, deliver a compelling closing statement. Summarize your key points and make a final appeal. (150 words)",
    "As the {{sideB}}, present your closing statement. Recap your main arguments and conclude strongly. (150 words)"
  ];

  const debateStructure = [
    "Moderator",
    "Proponent",
    "Opponent",
    "Proponent",
    "Opponent",
    "Opponent",
    "Proponent",
    "Proponent",
    "Opponent"
  ];

  const [debateParts, _] = await MinimalChainable.run(
    context,
    MODEL_NAME,
    async (model, prompt) => {
      const fullPrompt = `${prompt}\n\nRemember, this is part of a larger debate. Here's what has happened so far:\n\n${context.fullDebate}\n\nNow, continue the debate:`;
      const response = await askAI(API_URL, model, replacePlaceholders(fullPrompt, context));
      context.fullDebate += `${response}\n\n`;
      return response;
    },
    prompts
  );

  log("\nHere's our AI-generated debate:\n", '🎬');
  
  const formattedDebate = debateParts.map((part, index) => {
    return `${debateStructure[index]}:\n${part.trim()}\n`;
  }).join("\n");

  log(formattedDebate);

  const logsDir = path.join(__dirname, 'logs');
  const { filePath } = writeTimestampedFile('debate', formattedDebate, logsDir);
  log(`Our debate has been saved in '${filePath}'!`, '📝');
}

async function startDebate() {
  const topic = "Should homework be banned?";
  const safeRunDebate = asyncErrorHandler(runDebate);
  await safeRunDebate(topic);
}

module.exports = { startDebate };

if (require.main === module) {
  startDebate().catch(error => logError("Oops! Our debate hit a snag:", error));
}