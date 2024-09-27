const MinimalChainable = require('../../MinimalChainable');
const fetch = require('node-fetch');
require('dotenv').config();

const API_URL = process.env.API_URL;
const MODEL_NAME = process.env.MODEL_NAME;

async function askAI(model, prompt) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        prompt: prompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("🙈 Oops! Couldn't talk to our AI friend:", error);
    return "The magical AI is taking a nap. Let's try again later!";
  }
}

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