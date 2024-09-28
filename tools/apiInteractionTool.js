// apiInteractionTool.js

// We're bringing in a special helper that's really good at talking to other computers
const axios = require('axios');  // This is like a telephone that can call other programs!

/**
 * This is our magic function that can ask other programs for information
 * @param {string} url - This is the address of the program we want to talk to
 * @param {string} method - This is how we want to talk (like asking a question or telling something)
 * @param {object} data - This is any information we want to send to the other program
 * @return {Promise<object>} - This is the magic spell (Promise) that will give us the answer from the other program
 */
async function makeApiRequest(url, method = 'GET', data = null) {
  try {
    // We're using our special telephone to call the other program
    const response = await axios({
      method: method,
      url: url,
      data: data
    });
    
    // We're returning the answer we got from the other program
    return response.data;
  } catch (error) {
    // Uh-oh! If we couldn't talk to the other program, we'll let our AI friend know
    console.error('Oops! Something went wrong while trying to talk to the other program:', error.message);
    return `I couldn't get an answer because: ${error.message}`;
  }
}

/**
 * This is a special function that helps us talk to programs that need a secret password
 * @param {string} url - This is the address of the program we want to talk to
 * @param {string} apiKey - This is our secret password
 * @param {string} method - This is how we want to talk (like asking a question or telling something)
 * @param {object} data - This is any information we want to send to the other program
 * @return {Promise<object>} - This is the magic spell (Promise) that will give us the answer from the other program
 */
async function makeAuthenticatedApiRequest(url, apiKey, method = 'GET', data = null) {
  try {
    // We're using our special telephone to call the other program, but this time we're also sending our secret password
    const response = await axios({
      method: method,
      url: url,
      headers: { 'Authorization': `Bearer ${apiKey}` },
      data: data
    });
    
    // We're returning the answer we got from the other program
    return response.data;
  } catch (error) {
    // Uh-oh! If we couldn't talk to the other program, we'll let our AI friend know
    console.error('Oops! Something went wrong while trying to talk to the other program:', error.message);
    return `I couldn't get an answer because: ${error.message}`;
  }
}

// We're making our API talking functions available for other parts of our program to use
module.exports = {
  makeApiRequest,
  makeAuthenticatedApiRequest
};