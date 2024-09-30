// demos/EmojiStoryChallenge.js

const { askOpenAI } = require('../utils/openAiUtils')
const { log, logError } = require('../utils/loggerUtils')
const { asyncErrorHandler } = require('../utils/errorUtils')
const readline = require('readline')
const { z } = require('zod')

// Define schemas for our expected responses
const EmojiStorySchema = z.object({
  story: z.string().describe('The emoji story'),
  explanation: z
    .string()
    .describe(
      'A brief explanation of what the emojis represent, including the twist'
    ),
})

const TranslatedStorySchema = z.object({
  translation: z
    .string()
    .describe('The fairy tale translation of the emoji story'),
  interpretation: z
    .string()
    .describe('An interpretation of what the story means'),
})

/**
 * This function asks OpenAI to create an emoji story
 * @param {string} theme - The theme for our emoji story
 * @returns {Promise<Object>} - A promise that will give us our emoji story and explanation
 */
async function generateEmojiStory(theme) {
  const prompt = `Create a short story using only emojis based on the theme: "${theme}". 
                  Include an unexpected twist or surprise in the story.
                  Then provide a brief explanation of what the emojis represent, including the twist.
                  Respond with a JSON object containing 'story' (the emoji story) and 'explanation'.`

  return askOpenAI(prompt, EmojiStorySchema)
}

/**
 * This function asks OpenAI to translate the emoji story back to text
 * @param {string} emojiStory - The emoji story to translate
 * @returns {Promise<Object>} - A promise that will give us our translated story and interpretation
 */
async function translateEmojiStory(emojiStory) {
  const prompt = `Translate this emoji story into text: "${emojiStory}".
                  Be creative with your translation - tell the story in the style of a fairy tale.
                  Then provide an interpretation of what you think the story means.
                  Respond with a JSON object containing 'translation' and 'interpretation'.`

  return askOpenAI(prompt, TranslatedStorySchema)
}

/**
 * This function gets user input from the command line
 * @param {string} question - The question to ask the user
 * @returns {Promise<string>} - A promise that will give us the user's input
 */
function getUserInput(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close()
      resolve(answer)
    })
  })
}

/**
 * This is our main function that runs the whole Emoji Story Challenge
 */
async function runEmojiStoryChallenge() {
  try {
    log('Welcome to the Emoji Story Challenge! 📚✨', '🎉')

    // Get theme from user input
    const theme = await getUserInput('Enter a theme for your emoji story: ')
    log(`Our theme today is: "${theme}"`, '🎨')

    // First, we generate our emoji story
    log('Generating emoji story...', '🤖')
    const { story, explanation } = await generateEmojiStory(theme)
    log(`Emoji Story: ${story}`, '📜')
    log(`Explanation: ${explanation}`, '💡')

    // Then, we translate it back to text
    log(
      "Now, let's translate this back to text in the style of a fairy tale...",
      '🔄'
    )
    const { translation, interpretation } = await translateEmojiStory(story)
    log(`Fairy Tale Translation: ${translation}`, '🧚')
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
  safeRunEmojiStoryChallenge().catch((error) =>
    logError('A critical error occurred:', error)
  )
}

// We're making our challenge available for other parts of our program to use
module.exports = {
  runEmojiStoryChallenge,
}
