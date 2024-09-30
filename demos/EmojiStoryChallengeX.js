// demos/EmojiStoryChallenge.js

const { askAI } = require('../utils/aiUtils')
const { log, logError } = require('../utils/loggerUtils')
const { asyncErrorHandler } = require('../utils/errorUtils')
const { getEnvVariable } = require('../utils/envUtils')

// We're getting the API URL and model name from our environment variables
const API_URL = getEnvVariable('API_URL')
const MODEL_NAME = getEnvVariable('MODEL_NAME')

/**
 * This function asks our AI friend to create an emoji story
 * @param {string} theme - The theme for our emoji story
 * @returns {Promise<string>} - A promise that will give us our emoji story
 */
async function generateEmojiStory(theme) {
  const prompt = `Create a short story using only emojis based on the theme: "${theme}". 
                  Then provide a brief explanation of what the emojis represent.
                  Format your response as:
                  Emoji Story: [your emoji story here]
                  Explanation: [your explanation here]`

  return askAI(API_URL, MODEL_NAME, prompt)
}

/**
 * This function asks our AI friend to translate the emoji story back to text
 * @param {string} emojiStory - The emoji story to translate
 * @returns {Promise<string>} - A promise that will give us our translated story
 */
async function translateEmojiStory(emojiStory) {
  const prompt = `Translate this emoji story into text: "${emojiStory}".
                  Then provide an interpretation of what you think the story means.
                  Format your response as:
                  Translation: [your translation here]
                  Interpretation: [your interpretation here]`

  return askAI(API_URL, MODEL_NAME, prompt)
}

/**
 * This function extracts the emoji story and explanation from the AI's response
 * @param {string} response - The AI's response
 * @returns {Object} - An object containing the story and explanation
 */
function parseEmojiStoryResponse(response) {
  const storyMatch = response.match(/Emoji Story: (.*)/)
  const explanationMatch = response.match(/Explanation: (.*)/)

  return {
    story: storyMatch ? storyMatch[1].trim() : 'Could not generate emoji story',
    explanation: explanationMatch
      ? explanationMatch[1].trim()
      : 'No explanation provided',
  }
}

/**
 * This function extracts the translation and interpretation from the AI's response
 * @param {string} response - The AI's response
 * @returns {Object} - An object containing the translation and interpretation
 */
function parseTranslationResponse(response) {
  const translationMatch = response.match(/Translation: (.*)/)
  const interpretationMatch = response.match(/Interpretation: (.*)/)

  return {
    translation: translationMatch
      ? translationMatch[1].trim()
      : 'Could not translate emoji story',
    interpretation: interpretationMatch
      ? interpretationMatch[1].trim()
      : 'No interpretation provided',
  }
}

/**
 * This is our main function that runs the whole Emoji Story Challenge
 * @param {string} theme - The theme for our emoji story
 */
async function runEmojiStoryChallenge(theme) {
  try {
    log('Welcome to the Emoji Story Challenge! 📚✨', '🎉')
    log(`Our theme today is: "${theme}"`, '🎨')

    // First, we generate our emoji story
    log('Generating emoji story...', '🤖')
    const emojiStoryResponse = await generateEmojiStory(theme)
    const { story, explanation } = parseEmojiStoryResponse(emojiStoryResponse)
    log(`Emoji Story: ${story}`, '📜')
    log(`Explanation: ${explanation}`, '💡')

    // Then, we translate it back to text
    log("Now, let's translate this back to text...", '🔄')
    const translationResponse = await translateEmojiStory(story)
    const { translation, interpretation } =
      parseTranslationResponse(translationResponse)
    log(`Translation: ${translation}`, '🗣️')
    log(`Interpretation: ${interpretation}`, '🤔')

    log('Emoji Story Challenge completed!', '🎊')
  } catch (error) {
    logError('Oops! Our emoji story got lost in translation:', error)
  }
}

// This is like a safety net for our main function
const safeRunEmojiStoryChallenge = asyncErrorHandler(runEmojiStoryChallenge)

// This is where we actually start our challenge. It's like pressing the "Start" button!
if (require.main === module) {
  const theme = 'A day at the beach' // You can change this to any theme you like!
  safeRunEmojiStoryChallenge(theme).catch((error) =>
    logError('A critical error occurred:', error)
  )
}

// We're making our challenge available for other parts of our program to use
module.exports = {
  runEmojiStoryChallenge,
}
