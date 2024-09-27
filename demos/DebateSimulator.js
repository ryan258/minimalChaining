// demos/DebateSimulator.js

// First, we import all the tools we need for our debate simulator
const MinimalChainable = require('../MinimalChainable');
const { askAI } = require('../utils/aiUtils');
const { writeTimestampedFile } = require('../utils/fileUtils');
const { log, logError } = require('../utils/loggerUtils');
const { asyncErrorHandler } = require('../utils/errorUtils');
const { getEnvVariable } = require('../utils/envUtils');
const { replacePlaceholders } = require('../utils/stringUtils');
const path = require('path');

// We're getting the secret ingredients (API_URL and MODEL_NAME) from our magic recipe book (.env file)
const API_URL = getEnvVariable('API_URL');
const MODEL_NAME = getEnvVariable('MODEL_NAME');

// This is our main debate function. It's like a big stage where our AI debaters will perform!
async function runDebate(topic) {
  // We start by welcoming everyone to our AI Debate Simulator!
  log(`Welcome to the AI Debate Simulator! Today's topic: "${topic}"`, '🎭');

  // This is like our debate script. We're setting up the structure of our debate.
  const context = {
    topic: topic,
    sideA: "Proponent",
    sideB: "Opponent"
  };

  // These are like the different parts of our debate. Each prompt tells the AI what part of the debate to generate next!
  const prompts = [
    "Introduce the debate topic '{{topic}}' in a neutral manner.",
    "Generate an opening statement for the {{sideA}} of '{{topic}}'.",
    "Generate an opening statement for the {{sideB}} of '{{topic}}'.",
    "Present the first main argument for the {{sideA}} of '{{topic}}'.",
    "Generate a rebuttal from the {{sideB}} to the first argument of the {{sideA}}.",
    "Present the first main argument for the {{sideB}} of '{{topic}}'.",
    "Generate a rebuttal from the {{sideA}} to the first argument of the {{sideB}}.",
    "Generate a closing statement for the {{sideA}} of '{{topic}}'.",
    "Generate a closing statement for the {{sideB}} of '{{topic}}'."
  ];

  // Now, we're asking our AI friend to help us generate the debate. It's like having a super-smart debate coach!
  const [debateParts, _] = await MinimalChainable.run(
    context, 
    MODEL_NAME, 
    (model, prompt) => askAI(API_URL, model, replacePlaceholders(prompt, context)), 
    prompts
  );

  // We're announcing that our debate is ready!
  log("\nHere's our AI-generated debate:\n", '🎬');
  
  // We're presenting each part of our debate
  const debateStructure = [
    "Topic Introduction",
    "Opening Statement (Proponent)",
    "Opening Statement (Opponent)",
    "First Argument (Proponent)",
    "Rebuttal (Opponent)",
    "First Argument (Opponent)",
    "Rebuttal (Proponent)",
    "Closing Statement (Proponent)",
    "Closing Statement (Opponent)"
  ];
  
  debateParts.forEach((part, index) => {
    log(`${debateStructure[index]}:\n${part}\n`);
  });

  // Now, we're saving our debate in a special file so we can read it again later!
  const logsDir = path.join(__dirname, 'logs');
  const { filePath } = writeTimestampedFile('debate', debateParts, logsDir);
  log(`Our debate has been saved in '${filePath}'!`, '📝');
}

// This is our main function that sets up and runs the debate
async function startDebate() {
  // We're asking for a debate topic. It's like choosing what game we want to play!
  const topic = "Should homework be banned?"; // You can change this topic or make it user-input
  
  // This is like a safety net. If anything goes wrong while we're making our debate, it catches the problem and tells us about it.
  const safeRunDebate = asyncErrorHandler(runDebate);
  
  // This is where we actually start our debate. It's like pressing the "Start" button on our debate machine!
  await safeRunDebate(topic);
}

// This line makes our debate simulator ready to be used by other parts of our program
module.exports = { startDebate };

// If we're running this file directly (not importing it somewhere else), we start the debate!
if (require.main === module) {
  startDebate().catch(error => logError("Oops! Our debate hit a snag:", error));
}