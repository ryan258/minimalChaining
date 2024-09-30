// demos/EmojiStoryChallenge.js

const { askOpenAI } = require('../utils/openAiUtils')
const { log, logError } = require('../utils/loggerUtils')
const { asyncErrorHandler } = require('../utils/errorUtils')
const { z } = require('zod')

// This is like a recipe for how we want our emoji story to look
const EmojiStorySchema = z.object({
  story: z.string().describe('The emoji story'),
  explanation: z
    .string()
    .describe('A brief explanation of what the emojis represent'),
})

// This is like a recipe for how we want our translated story to look
const TranslatedStorySchema = z.object({
  translation: z
    .string()
    .describe('The translation of the emoji story to text'),
  interpretation: z
    .string()
    .describe("An interpretation of the story's meaning"),
})

/**
 * This function asks our AI friend to create an emoji story
 * @param {string} theme - The theme for our emoji story
 * @returns {Promise<Object>} - A promise that will give us our emoji story
 */
async function generateEmojiStory(theme) {
  const prompt = `Create a short story using only emojis based on the theme: "${theme}". 
                  Then provide a brief explanation of what the emojis represent.
                  Respond with a JSON object containing 'story' (the emoji story) and 'explanation'.`

  return askOpenAI(prompt, EmojiStorySchema)
}

/**
 * This function asks our AI friend to translate the emoji story back to text
 * @param {string} emojiStory - The emoji story to translate
 * @returns {Promise<Object>} - A promise that will give us our translated story
 */
async function translateEmojiStory(emojiStory) {
  const prompt = `Translate this emoji story into text: "${emojiStory}".
                  Then provide an interpretation of what you think the story means.
                  Respond with a JSON object containing 'translation' and 'interpretation'.`

  return askOpenAI(prompt, TranslatedStorySchema)
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
    const { story, explanation } = await generateEmojiStory(theme)
    log(`Emoji Story: ${story}`, '📜')
    log(`Explanation: ${explanation}`, '💡')

    // Then, we translate it back to text
    log("Now, let's translate this back to text...", '🔄')
    const { translation, interpretation } = await translateEmojiStory(story)
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
