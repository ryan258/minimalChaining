// webScrapingTool.js

// We're bringing in some helpful tools to make our web scraping magic happen!
const axios = require('axios');  // This is like a super-smart web browser
const cheerio = require('cheerio');  // This helps us understand and work with web pages

/**
 * This is our special function that can read web pages for our AI friend
 * @param {string} url - This is the web address we want to read
 * @return {Promise<string>} - This is the magic spell (Promise) that will give us the web page content
 */
async function scrapeWebpage(url) {
  try {
    // First, we're sending our magic browser (axios) to fetch the web page
    const response = await axios.get(url);
    
    // Now, we're using our special helper (cheerio) to understand the web page
    const $ = cheerio.load(response.data);
    
    // We're looking for the main part of the web page (usually in the <body> tag)
    const pageContent = $('body').text();
    
    // We're cleaning up the content to make it neat and tidy
    const cleanContent = pageContent.replace(/\s+/g, ' ').trim();
    
    // Here's the neat and tidy content for our AI friend to read!
    return cleanContent;
  } catch (error) {
    // Uh-oh! If something goes wrong, we'll let our AI friend know
    console.error('Oops! Something went wrong while trying to read the web page:', error.message);
    return `I couldn't read the web page because: ${error.message}`;
  }
}

// We're making our web reading function available for other parts of our program to use
module.exports = {
  scrapeWebpage
};