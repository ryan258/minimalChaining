// utils/openAiUtils.js

// We're bringing in some helpful tools to make our code work smoothly
const fetch = require('node-fetch');  // This is like a messenger that can send and receive information from the internet
const { getEnvVariable } = require('./envUtils');  // This helps us get secret information safely

// This is the main function that talks to the OpenAI robot brain
async function askOpenAI(prompt) {
  // First, we get the secret key to talk to OpenAI. It's like a special password!
  const apiKey = getEnvVariable('OPENAI_API_KEY');
  
  // We're also getting the name of the specific OpenAI model we want to use
  const modelName = getEnvVariable('OPENAI_MODEL');
  
  // This is the address where OpenAI's robot brain lives
  const apiUrl = 'https://api.openai.com/v1/chat/completions';

  try {
    // Now we're sending a message to OpenAI's robot brain
    const response = await fetch(apiUrl, {
      method: 'POST',  // This means we're sending information, not just asking for it
      headers: {
        'Content-Type': 'application/json',  // This tells OpenAI what kind of information we're sending
        'Authorization': `Bearer ${apiKey}`  // This is like showing our ID to prove we're allowed to talk to OpenAI
      },
      body: JSON.stringify({  // We're turning our message into a special format that OpenAI understands
        model: modelName,  // This is the specific robot brain we want to talk to, which we got from our secret recipe book (.env)
        messages: [{ role: "user", content: prompt }],  // This is our message to the robot brain
        temperature: 0.7  // This is how creative we want the robot brain to be (higher = more creative)
      })
    });

    // If something went wrong with our message, we'll let someone know
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    // We're taking the robot brain's response and turning it into something we can understand
    const data = await response.json();
    
    // We're returning just the part of the response that we care about - the actual message from the robot brain
    return data.choices[0].message.content;
  } catch (error) {
    // If anything goes wrong, we'll shout for help!
    console.error("🚨 Oops! Something went wrong when talking to OpenAI:", error);
    return "I couldn't get an answer from OpenAI right now. Let's try again later!";
  }
}

// We're making our function available for other parts of our program to use
module.exports = {
  askOpenAI
};