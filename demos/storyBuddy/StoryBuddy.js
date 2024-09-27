// demos/storyBuddy/StoryBuddy.js

const MinimalChainable = require('../../MinimalChainable');
const { askAI } = require('../../utils/aiUtils');
const { writeTimestampedFile } = require('../../utils/fileUtils');
const { log, logError } = require('../../utils/loggerUtils');
const { asyncErrorHandler } = require('../../utils/errorUtils');
const { getEnvVariable } = require('../../utils/envUtils');
const { replacePlaceholders } = require('../../utils/stringUtils');
const path = require('path');

const API_URL = getEnvVariable('API_URL');
const MODEL_NAME = getEnvVariable('MODEL_NAME');

async function createStory() {
  log("Welcome to Story Buddy! Let's create a magical tale together!", '🔮');

  const context = {
    hero: "a brave little mouse named Pip",
    villain: "a grumpy old cat named Whiskers",
    magic_item: "a glowing cheese wheel"
  };

  const prompts = [
    "Write a short paragraph introducing {{hero}} who lives in a cozy treehouse.",
    "Continue the story: {{hero}} discovers {{magic_item}}. Describe what happens in a brief paragraph.",
    "Continue the story: Suddenly, {{villain}} appears and wants to steal {{magic_item}}! Write a short, exciting paragraph about this confrontation.",
    "Conclude the story: Describe how {{hero}} cleverly outsmarts {{villain}} and saves the day."
  ];

  const [storyParts, _] = await MinimalChainable.run(
    context, 
    MODEL_NAME, 
    (model, prompt) => askAI(API_URL, model, replacePlaceholders(prompt, context)), 
    prompts
  );

  log("\nHere's our magical story:\n", '📘');
  storyParts.forEach((part, index) => {
    log(`Chapter ${index + 1}: ${part}\n`);
  });

  const logsDir = path.join(__dirname, 'logs');
  const storyContent = storyParts.map((part, index) => `## Chapter ${index + 1}\n\n${part}\n\n`).join('');
  const filePath = writeTimestampedFile('story', storyContent, logsDir);
  log(`Our story has been saved in '${filePath}'!`, '✨');
}

const safeCreateStory = asyncErrorHandler(createStory);

safeCreateStory().catch(error => logError("A bit of magic went wrong:", error));