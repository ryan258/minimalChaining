// demos/storyBuddy/StoryBuddy.js

const MinimalChainable = require('../../MinimalChainable');
const { askOpenAI } = require('../../utils/openAiUtils');
const { writeTimestampedFile } = require('../../utils/fileUtils');
const { log, logError } = require('../../utils/loggerUtils');
const { asyncErrorHandler } = require('../../utils/errorUtils');
const { getEnvVariable } = require('../../utils/envUtils');
const { replacePlaceholders } = require('../../utils/stringUtils');
const path = require('path');
const { z } = require('zod');  // This is our new friend that helps us define data structures

// We're getting the secret ingredients from our magic recipe book (.env file)
const MODEL_NAME = getEnvVariable('OPENAI_MODEL');

// This is our story schema - it's like a template for our AI to fill in
const StorySchema = z.object({
  content: z.string().describe("The content of the story part"),
  mood: z.enum(["happy", "sad", "excited", "mysterious"]).describe("The mood of this part of the story")
});

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
    "Write a short paragraph introducing {{hero}} who lives in a cozy treehouse. Respond with a JSON object containing 'content' (the paragraph) and 'mood' (one of: happy, sad, excited, mysterious).",
    "Continue the story: {{hero}} discovers {{magic_item}}. Describe what happens in a brief paragraph. Respond with a JSON object containing 'content' (the paragraph) and 'mood' (one of: happy, sad, excited, mysterious).",
    "Continue the story: Suddenly, {{villain}} appears and wants to steal {{magic_item}}! Write a short, exciting paragraph about this confrontation. Respond with a JSON object containing 'content' (the paragraph) and 'mood' (one of: happy, sad, excited, mysterious).",
    "Conclude the story: Describe how {{hero}} cleverly outsmarts {{villain}} and saves the day. Respond with a JSON object containing 'content' (the paragraph) and 'mood' (one of: happy, sad, excited, mysterious)."
  ];

  // Now, we're asking our AI friend to help us write the story. It's like having a magical storytelling assistant!
  log(`Creating a story with our AI model (${MODEL_NAME})...`, '🤖');
  const [storyParts, _] = await MinimalChainable.run(
    context, 
    MODEL_NAME, 
    async (prompt) => {
      const result = await askOpenAI(replacePlaceholders(prompt, context), StorySchema);
      if (result.error) {
        log(`Oops! There was a problem with this part of the story: ${result.error}`, '⚠️');
        return { content: "Our storyteller needed a break here. Let's imagine something wonderful happened!", mood: "mysterious" };
      }
      return result;
    }, 
    prompts
  );

  // We're announcing that our story is ready!
  log(`\nHere's our magical story from the AI (${MODEL_NAME}):\n`, '📘');
  storyParts.forEach((part, index) => {
    log(`Chapter ${index + 1} (${part.mood}):\n${part.content}\n`);
  });

  // Now, we're saving our story in a special book (file) so we can read it again later!
  const logsDir = path.join(__dirname, 'logs');
  const { filePath } = writeTimestampedFile(`story_${MODEL_NAME}`, storyParts, logsDir);
  log(`Our story has been saved in '${filePath}'!`, '✨');
}

// This is like a safety net. If anything goes wrong while we're making our story, it catches the problem and tells us about it.
const safeCreateStory = asyncErrorHandler(createStory);

// This is where we actually start making our story. It's like pressing the "Start" button on our story machine!
safeCreateStory().catch(error => logError("A bit of magic went wrong:", error));