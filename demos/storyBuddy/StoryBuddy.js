// demos/storyBuddy/StoryBuddy.js

const MinimalChainable = require('../../MinimalChainable');
const { askAI } = require('../../utils/aiUtils');
const path = require('path');
require('dotenv').config();

const API_URL = process.env.API_URL;
const MODEL_NAME = process.env.MODEL_NAME;

async function createStory() {
  console.log("🔮 Welcome to Story Buddy! Let's create a magical tale together! 🔮");

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
    (model, prompt) => askAI(API_URL, model, prompt), 
    prompts
  );

  console.log("\n📘 Here's our magical story:\n");
  storyParts.forEach((part, index) => {
    console.log(`Chapter ${index + 1}: ${part}\n`);
  });

  try {
    const logsDir = path.join(__dirname, 'logs');
    const { resultString, filePath } = MinimalChainable.toDelimTextFile('story', storyParts, logsDir);
    console.log(`✨ Our story has been saved in '${filePath}'! ✨`);
  } catch (error) {
    console.error("🙈 Oops! We couldn't save the story:", error);
  }
}

createStory().catch(error => console.error("🙈 Oops! A bit of magic went wrong:", error));