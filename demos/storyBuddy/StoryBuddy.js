// demos/storyBuddy/StoryBuddy.js

// First, we import all the tools we need for our story-making adventure!
const MinimalChainable = require('../../MinimalChainable');
const { askAI } = require('../../utils/aiUtils');
const { writeTimestampedFile } = require('../../utils/fileUtils');
const { log, logError } = require('../../utils/loggerUtils');
const { asyncErrorHandler } = require('../../utils/errorUtils');
const { getEnvVariable } = require('../../utils/envUtils');
const { replacePlaceholders } = require('../../utils/stringUtils');
const path = require('path');

// We're getting the secret ingredients (API_URL and MODEL_NAME) from our magic recipe book (.env file)
const API_URL = getEnvVariable('API_URL');
const MODEL_NAME = getEnvVariable('MODEL_NAME');

// This is our main story-making function. It's like a big pot where we mix all our story ingredients!
async function createStory() {
  // We start by welcoming everyone to our story-making adventure!
  log("Welcome to Story Buddy! Let's create a magical tale together!", '🔮');

  // This is like our story's recipe. We're deciding who our characters are and what magical item they'll find!
  const context = {
    hero: "a brave little mouse named Pip",
    villain: "a grumpy old cat named Whiskers",
    magic_item: "a glowing cheese wheel"
  };

  // These are like the steps in our recipe. Each step tells the AI what part of the story to write next!
  const prompts = [
    "Write a short paragraph introducing {{hero}} who lives in a cozy treehouse.",
    "Continue the story: {{hero}} discovers {{magic_item}}. Describe what happens in a brief paragraph.",
    "Continue the story: Suddenly, {{villain}} appears and wants to steal {{magic_item}}! Write a short, exciting paragraph about this confrontation.",
    "Conclude the story: Describe how {{hero}} cleverly outsmarts {{villain}} and saves the day."
  ];

  // Now, we're asking our AI friend to help us write the story. It's like having a magical storytelling assistant!
  const [storyParts, _] = await MinimalChainable.run(
    context, 
    MODEL_NAME, 
    (model, prompt) => askAI(API_URL, model, replacePlaceholders(prompt, context)), 
    prompts
  );

  // We're announcing that our story is ready!
  log("\nHere's our magical story:\n", '📘');
  
  // We're reading each part of our story out loud
  storyParts.forEach((part, index) => {
    log(`Chapter ${index + 1}: ${part}\n`);
  });

  // Now, we're saving our story in a special book (file) so we can read it again later!
  const logsDir = path.join(__dirname, 'logs');
  // We're just passing the raw story parts to writeTimestampedFile now
  const { filePath } = writeTimestampedFile('story', storyParts, logsDir);
  log(`Our story has been saved in '${filePath}'!`, '✨');
}

// This is like a safety net. If anything goes wrong while we're making our story, it catches the problem and tells us about it.
const safeCreateStory = asyncErrorHandler(createStory);

// This is where we actually start making our story. It's like pressing the "Start" button on our story machine!
safeCreateStory().catch(error => logError("A bit of magic went wrong:", error));