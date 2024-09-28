// demos/storyBuddy/StoryBuddy.js

// First, we import all the tools we need for our story-making adventure!
const MinimalChainable = require('../../MinimalChainable');
const { askAI } = require('../../utils/aiUtils');
const { askOpenAI } = require('../../utils/openAiUtils');  // This is our OpenAI helper!
const { writeTimestampedFile } = require('../../utils/fileUtils');
const { log, logError } = require('../../utils/loggerUtils');
const { asyncErrorHandler } = require('../../utils/errorUtils');
const { getEnvVariable } = require('../../utils/envUtils');
const { replacePlaceholders } = require('../../utils/stringUtils');
const path = require('path');

// We're getting the secret ingredients from our magic recipe book (.env file)
const API_URL = getEnvVariable('API_URL');
const LOCAL_MODEL_NAME = getEnvVariable('MODEL_NAME');
const OPENAI_MODEL_NAME = getEnvVariable('OPENAI_MODEL');

// This is our main story-making function. It's like a big pot where we mix all our story ingredients!
async function createStory() {
  // We start by welcoming everyone to our story-making adventure!
  log("Welcome to Story Buddy! Let's create magical tales together!", '🔮');

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

  // Now, we're asking our AI friends to help us write the stories. It's like having two magical storytelling assistants!
  log(`Creating a story with our local AI model (${LOCAL_MODEL_NAME})...`, '🤖');
  const [localStoryParts, _] = await MinimalChainable.run(
    context, 
    LOCAL_MODEL_NAME, 
    (model, prompt) => askAI(API_URL, model, replacePlaceholders(prompt, context)), 
    prompts
  );

  log(`Creating another story with OpenAI model (${OPENAI_MODEL_NAME})...`, '🌐');
  const openAIStoryParts = await Promise.all(prompts.map(prompt => 
    askOpenAI(replacePlaceholders(prompt, context))
  ));

  // We're announcing that our stories are ready!
  log(`\nHere's our magical story from the local AI (${LOCAL_MODEL_NAME}):\n`, '📘');
  localStoryParts.forEach((part, index) => {
    log(`Chapter ${index + 1}: ${part}\n`);
  });

  log(`\nAnd here's another version from OpenAI (${OPENAI_MODEL_NAME}):\n`, '📕');
  openAIStoryParts.forEach((part, index) => {
    log(`Chapter ${index + 1}: ${part}\n`);
  });

  // Now, we're saving both stories in special books (files) so we can read them again later!
  const logsDir = path.join(__dirname, 'logs');
  const { filePath: localFilePath } = writeTimestampedFile(`local_story_${LOCAL_MODEL_NAME}`, localStoryParts, logsDir);
  const { filePath: openAIFilePath } = writeTimestampedFile(`openai_story_${OPENAI_MODEL_NAME}`, openAIStoryParts, logsDir);
  log(`Our local AI story has been saved in '${localFilePath}'!`, '✨');
  log(`Our OpenAI story has been saved in '${openAIFilePath}'!`, '✨');
}

// This is like a safety net. If anything goes wrong while we're making our story, it catches the problem and tells us about it.
const safeCreateStory = asyncErrorHandler(createStory);

// This is where we actually start making our story. It's like pressing the "Start" button on our story machine!
safeCreateStory().catch(error => logError("A bit of magic went wrong:", error));