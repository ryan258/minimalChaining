// utils/openAiUtils.js

const fetch = require('node-fetch')
const { getEnvVariable } = require('./envUtils')
const { z } = require('zod')

/**
 * This is our magical function that talks to the OpenAI robot brain and asks for a structured response
 * @param {string} prompt - This is our question or request for the AI
 * @param {z.ZodType} schema - This is like a blueprint for how we want the AI to format its answer
 * @return {Promise<Object>} - This is the magic spell (Promise) that will give us the AI's structured response
 */
async function askOpenAI(prompt, schema) {
  // First, we get the secret key to talk to OpenAI. It's like a special password!
  const apiKey = getEnvVariable('OPENAI_API_KEY')

  // We're also getting the name of the specific OpenAI model we want to use
  const modelName = getEnvVariable('OPENAI_MODEL')

  // This is the address where OpenAI's robot brain lives
  const apiUrl = 'https://api.openai.com/v1/chat/completions'

  try {
    // Now we're sending a message to OpenAI's robot brain
    const response = await fetch(apiUrl, {
      method: 'POST', // This means we're sending information, not just asking for it
      headers: {
        'Content-Type': 'application/json', // This tells OpenAI what kind of information we're sending
        Authorization: `Bearer ${apiKey}`, // This is like showing our ID to prove we're allowed to talk to OpenAI
      },
      body: JSON.stringify({
        // We're turning our message into a special format that OpenAI understands
        model: modelName, // This is the specific robot brain we want to talk to
        messages: [{ role: 'user', content: prompt }], // This is our message to the robot brain
        temperature: 0.7, // This is how creative we want the robot brain to be (higher = more creative)
        response_format: { type: 'json_object' }, // This tells OpenAI we want a JSON response
      }),
    })

    // If something went wrong with our message, we'll let someone know
    if (!response.ok) {
      const errorBody = await response.text()
      throw new Error(
        `OpenAI API error: ${response.status} ${response.statusText}\n${errorBody}`
      )
    }

    // We're taking the robot brain's response and turning it into something we can understand
    const data = await response.json()

    // We're getting just the part of the response that we care about - the actual message from the robot brain
    const content = JSON.parse(data.choices[0].message.content)

    // We're using our blueprint (schema) to make sure the AI's answer is in the right format
    return schema.parse(content)
  } catch (error) {
    // If anything goes wrong, we'll shout for help!
    console.error(
      '🚨 Oops! Something went wrong when talking to OpenAI:',
      error
    )
    if (error instanceof z.ZodError) {
      console.error(
        "The response didn't match our expected format:",
        error.errors
      )
    }
    throw error // We're throwing the error so the calling function can handle it
  }
}

// We're making our function available for other parts of our program to use
module.exports = {
  askOpenAI,
}
