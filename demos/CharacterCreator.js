// demos/CharacterCreator.js

// First, let's import all the tools we need for our character creation adventure!
const readline = require('readline');  // This is like a telephone that lets us talk to the user
const { askAI } = require('../utils/aiUtils');  // This is our AI friend who will help us create characters
const { log, logError } = require('../utils/loggerUtils');  // These help us write messages to the user
const { asyncErrorHandler } = require('../utils/errorUtils');  // This is our safety net for catching errors
const { getEnvVariable } = require('../utils/envUtils');  // This helps us get secret information
const { writeTimestampedFile } = require('../utils/fileUtils');  // This helps us save our character to a file
const path = require('path');  // This helps us work with file and directory paths

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

// This function asks our AI friend to help create a character trait
async function generateCharacterTrait(trait, context) {
  const prompt = `Based on the following context: "${context}", generate a ${trait} for a character. Be creative and specific.`;
  return askAI(API_URL, MODEL_NAME, prompt);
}

// This is our main function that runs the whole character creation process
async function createCharacter() {
  try {
    log("Welcome to the Character Creator! 📚✨", "🎭");

    // We ask the user for some basic information about their character
    const name = await askQuestion("What's your character's name? ");
    const genre = await askQuestion("What genre is your story? ");

    log(`Creating a character named ${name} for a ${genre} story...`, "🤖");

    // Now we ask our AI friend to help create various aspects of the character
    const [motivation, externalConflict, internalConflict, compellingTrait, wound, arc, realisticTrait, voice, silhouette] = await Promise.all([
      generateCharacterTrait("motivation", `${name} in a ${genre} story`),
      generateCharacterTrait("external conflict", `${name} in a ${genre} story`),
      generateCharacterTrait("internal conflict", `${name} in a ${genre} story`),
      generateCharacterTrait("compelling trait", `${name} in a ${genre} story`),
      generateCharacterTrait("character wound", `${name} in a ${genre} story`),
      generateCharacterTrait("character arc", `${name} in a ${genre} story`),
      generateCharacterTrait("realistic trait", `${name} in a ${genre} story`),
      generateCharacterTrait("unique voice", `${name} in a ${genre} story`),
      generateCharacterTrait("unique silhouette", `${name} in a ${genre} story`)
    ]);

    // We create an object with all our character's information
    const character = {
      name,
      genre,
      motivation,
      externalConflict,
      internalConflict,
      compellingTrait,
      wound,
      arc,
      realisticTrait,
      voice,
      silhouette
    };

    // We show the user the character our AI friend helped create
    log(`Here's your character, ${name}! 🎉`, "👤");
    console.log(JSON.stringify(character, null, 2));

    // Now we save our character to a file in the demos/logs directory
    const logsDir = path.join(__dirname, 'logs');  // This creates the path to our logs directory
    const { filePath } = writeTimestampedFile('character', JSON.stringify(character, null, 2), logsDir);
    log(`Your character has been saved in '${filePath}'!`, "📝");

    log("Character creation complete! Happy writing! 📝", "🎊");

    // We say goodbye and close our special telephone
    rl.close();
  } catch (error) {
    // If anything goes wrong, we let the user know
    logError("Oops! Something went wrong while creating your character:", error);
    rl.close();
  }
}

// This is like a safety net for our main function
const safeCreateCharacter = asyncErrorHandler(createCharacter);

// This is where we actually start our program
if (require.main === module) {
  safeCreateCharacter().catch((error) => {
    logError("A critical error occurred:", error);
    rl.close();
  });
}

// We're making our character creator available for other parts of our program to use
module.exports = {
  createCharacter
};