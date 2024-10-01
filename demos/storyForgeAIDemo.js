// demos/storyForgeAIDemo.js

// First, let's import all the tools we need for our story creation adventure!
const readline = require('readline');  // This is like a telephone that lets us talk to the user
const { askAI } = require('../utils/aiUtils');  // This is our AI friend who will help us write stories
const { getEnvVariable } = require('../utils/envUtils');  // This helps us get secret information
const { log, logError } = require('../utils/loggerUtils');  // These help us write messages to the user
const { writeTimestampedFile } = require('../utils/fileUtils');  // This helps us save our story

// We're getting the secret address and name of our AI friend
const API_URL = getEnvVariable('API_URL');
const MODEL_NAME = getEnvVariable('MODEL_NAME');

// This is like a special telephone that lets us ask the user questions
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// This function asks the user a question and waits for their answer
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// This function helps us talk to our AI friend
async function getAIResponse(prompt) {
  try {
    return await askAI(API_URL, MODEL_NAME, prompt);
  } catch (error) {
    logError("Oops! Our AI friend couldn't answer:", error);
    return "I'm sorry, but I couldn't come up with an answer. Let's try something else!";
  }
}

// This is our main function that runs the whole StoryForge AI demo
async function runStoryForgeDemo() {
  try {
    log("Welcome to StoryForge AI! Let's create a story together! 📚✨", "🎭");

    // Step 1: Brainstorming
    log("Step 1: Brainstorming", "🧠");
    const genre = await askQuestion("What genre would you like for your story? ");
    const brainstormPrompt = `Give me 5 unique premise ideas for a ${genre} story. Each premise should be a single sentence.`;
    const premises = await getAIResponse(brainstormPrompt);
    console.log("\nHere are some premise ideas:\n", premises);
    
    const chosenPremiseNumber = await askQuestion("Which premise number do you like best (1-5)? ");
    const chosenPremise = premises.split('\n')[parseInt(chosenPremiseNumber) - 1].replace(/^\d+\.\s*/, '');
    
    // Step 2: Generate Ending
    log("\nStep 2: Generating Ending", "🏁");
    const endingPrompt = `Given the premise: "${chosenPremise}", suggest 3 possible endings for this story.`;
    const endings = await getAIResponse(endingPrompt);
    console.log("\nHere are some possible endings:\n", endings);
    
    const chosenEndingNumber = await askQuestion("Which ending number do you like best (1-3)? ");
    const chosenEnding = endings.split('\n')[parseInt(chosenEndingNumber) - 1].replace(/^\d+\.\s*/, '');

    // Step 3: Synopsis
    log("\nStep 3: Creating Synopsis", "📝");
    const synopsisPrompt = `Create a detailed synopsis for a ${genre} story with the following premise: "${chosenPremise}" and ending: "${chosenEnding}". Use a three-act structure.`;
    const synopsis = await getAIResponse(synopsisPrompt);
    console.log("\nHere's your story synopsis:\n", synopsis);

    // Step 4: Character Profile
    log("\nStep 4: Developing Main Character", "👤");
    const characterPrompt = `Create a detailed character profile for the main character of our ${genre} story. Include physical description, personality traits, backstory, and their role in the story.`;
    const characterProfile = await getAIResponse(characterPrompt);
    console.log("\nHere's your main character profile:\n", characterProfile);

    // Step 5: Story Outline
    log("\nStep 5: Creating Story Outline", "📊");
    const outlinePrompt = `Using the synopsis and character profile, create a detailed 10-chapter outline for our ${genre} story. For each chapter, provide a brief summary of key events.`;
    const storyOutline = await getAIResponse(outlinePrompt);
    console.log("\nHere's your story outline:\n", storyOutline);

    // Step 6: Writing Style
    log("\nStep 6: Defining Writing Style", "✍️");
    const stylePrompt = `Suggest a writing style that would best suit our ${genre} story. Include aspects like point of view, tense, tone, and any specific stylistic elements.`;
    const writingStyle = await getAIResponse(stylePrompt);
    console.log("\nHere's the suggested writing style:\n", writingStyle);

    // Step 7: First Chapter
    log("\nStep 7: Writing the First Chapter", "📖");
    const chapterPrompt = `Write the opening paragraph of the first chapter for our ${genre} story. Use the following style: ${writingStyle}. Begin with the main character and set the tone for the story.`;
    const openingParagraph = await getAIResponse(chapterPrompt);
    console.log("\nHere's the opening paragraph of your story:\n", openingParagraph);

    // Save the story details
    const storyDetails = `
Genre: ${genre}
Premise: ${chosenPremise}
Ending: ${chosenEnding}

Synopsis:
${synopsis}

Main Character:
${characterProfile}

Story Outline:
${storyOutline}

Writing Style:
${writingStyle}

Opening Paragraph:
${openingParagraph}
    `;

    const { filePath } = writeTimestampedFile('story_details', storyDetails, './output');
    log(`\nYour story details have been saved to: ${filePath}`, "💾");

    log("\nCongratulations! You've created the foundation for your story using StoryForge AI!", "🎉");
    rl.close();
  } catch (error) {
    logError("Oops! Something went wrong in our story creation process:", error);
    rl.close();
  }
}

// This is where we actually start our StoryForge AI demo
runStoryForgeDemo().catch((error) => {
  logError("A critical error occurred:", error);
  rl.close();
});