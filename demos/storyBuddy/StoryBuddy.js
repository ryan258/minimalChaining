// 🌟 Welcome to the Magical Story Buddy Project! 🌟

const MinimalChainable = require('../../MinimalChainable');
require('dotenv').config();

const API_URL = process.env.API_URL;
const MODEL_NAME = process.env.MODEL_NAME;

// 🎭 This is our magical helper that talks to the AI
async function askAI(model, prompt) {
  // 🚀 In a real project, we'd send our question to the AI here
  // For now, let's create more varied responses
  const responses = [
    `In a cozy treehouse, ${prompt}`,
    `The ${prompt} sparkled with magical energy!`,
    `Suddenly, ${prompt} causing quite a commotion!`,
    `With quick thinking, ${prompt} saving the day!`
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}

async function createStory() {
  console.log("🔮 Welcome to Story Buddy! Let's create a magical tale together! 🔮");

  const context = {
    hero: "a brave little mouse named Pip",
    villain: "a grumpy old cat named Whiskers",
    magic_item: "a glowing cheese wheel"
  };

  const prompts = [
    "{{hero}} lived happily.",
    "{{hero}} found {{magic_item}}.",
    "{{villain}} tried to steal {{magic_item}}.",
    "{{hero}} cleverly tricked {{villain}}."
  ];

  const [storyParts, _] = await MinimalChainable.run(context, MODEL_NAME, askAI, prompts);

  console.log("\n📘 Here's our magical story:\n");
  storyParts.forEach((part, index) => {
    console.log(`Chapter ${index + 1}: ${part}\n`);
  });

  try {
    const savedStory = MinimalChainable.toDelimTextFile('our_magical_story', storyParts);
    console.log("✨ Our story has been saved in 'our_magical_story.txt'! ✨");
  } catch (error) {
    console.error("🙈 Oops! We couldn't save the story:", error);
  }
}

createStory().catch(error => console.error("🙈 Oops! A bit of magic went wrong:", error));