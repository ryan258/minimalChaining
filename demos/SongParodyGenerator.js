// SongParodyGenerator.js

// First, let's bring in our helpful tools!
const readline = require('readline');  // This is like a telephone that lets us talk to the user
const { askAI } = require('../utils/aiUtils');  // This is our AI friend who will help us write parodies
const { getEnvVariable } = require('../utils/envUtils');  // This helps us get secret information
const { log, logError } = require('../utils/loggerUtils');  // These help us write messages to the user

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

// This function asks our AI friend to suggest a title for our parody
async function generateParodyTitle(originalTitle, newTopic) {
  const prompt = `Suggest a funny title for a parody of "${originalTitle}" about "${newTopic}". 
                  The title should be no more than 80 characters long and should be a play on words 
                  related to both the original title and the new topic. Don't use quotes in the title.`;
  return askAI(API_URL, MODEL_NAME, prompt);
}

// This function asks our AI friend to describe the style of music for our parody
async function generateMusicStyleDescription(originalTitle, newTopic) {
  const prompt = `Describe the style of music for a parody of "${originalTitle}" about "${newTopic}". 
                  The description should be fun and imaginative, no more than 120 characters long. 
                  Combine elements of the original song's style with silly aspects related to the new topic.`;
  return askAI(API_URL, MODEL_NAME, prompt);
}

// This is our main function that runs the whole show
async function generateParody() {
  try {
    log("Welcome to the Song Parody Generator! 🎵", "🎭");

    // We ask the user for information about the song and the new topic
    const songTitle = await askQuestion("What's the title of the song you want to parody? ");
    const newTopic = await askQuestion("What new topic should the parody be about? ");

    log(`Creating a parody of "${songTitle}" about "${newTopic}"...`, "🤖");

    // Now we ask our AI friend to create the parody title, style description, and lyrics
    const [parodyTitle, musicStyle, parodyLyrics] = await Promise.all([
      generateParodyTitle(songTitle, newTopic),
      generateMusicStyleDescription(songTitle, newTopic),
      askAI(API_URL, MODEL_NAME, `Create a parody of the song "${songTitle}" about the topic "${newTopic}". 
                                   Please do not use any actual lyrics from the original song. 
                                   Instead, create entirely new, original lyrics that match the song's structure and rhyme scheme. 
                                   The parody should be fun and silly, appropriate for all ages. 
                                   Please provide the parody lyrics in the style of the song, but with completely original words.`)
    ]);

    // We show the user the parody our AI friend created
    log("Here's your parody! 🎉", "🎤");
    console.log(`Title: ${parodyTitle.trim()}`);
    console.log(`Style: ${musicStyle.trim()}`);
    console.log("\nLyrics:");
    console.log(parodyLyrics);

    // We say goodbye and close our special telephone
    rl.close();
  } catch (error) {
    // If anything goes wrong, we let the user know
    logError("Oops! Something went wrong while creating your parody:", error);
    rl.close();
  }
}

// This is where we actually start our program
generateParody().catch((error) => {
  logError("A critical error occurred:", error);
  rl.close();
});