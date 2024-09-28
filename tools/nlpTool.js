// nlpTool.js

// We're bringing in a smart friend who knows a lot about language
const natural = require('natural');  // This is like a language expert in a box!

// We're creating special tools for understanding language
const tokenizer = new natural.WordTokenizer();  // This helps us split sentences into words
const sentiment = new natural.SentimentAnalyzer("English", natural.PorterStemmer, "afinn");  // This helps us understand if something is happy or sad

/**
 * This is our magic function that can figure out if a sentence is happy or sad
 * @param {string} text - This is the sentence we want to understand
 * @return {string} - This tells us if the sentence is happy, sad, or neutral
 */
function analyzeSentiment(text) {
  // We're asking our language expert to look at the words and tell us the mood
  const score = sentiment.getSentiment(tokenizer.tokenize(text));
  
  // Based on the score, we decide if it's happy, sad, or in-between
  if (score > 0) return "positive";
  if (score < 0) return "negative";
  return "neutral";
}

/**
 * This is our magic function that can find important words (like names) in a sentence
 * @param {string} text - This is the sentence we want to examine
 * @return {string[]} - This gives us a list of important words it found
 */
function findNamedEntities(text) {
  // We're creating a special tool to find important words
  const ner = new natural.BrillPOSTagger();
  
  // We're asking our tool to look at each word and tell us if it's important
  const taggedWords = ner.tag(tokenizer.tokenize(text));
  
  // We're picking out the words that our tool thinks are names of things
  return taggedWords
    .filter(tag => tag[1] === 'NNP')  // NNP means "proper noun" - usually a name of something
    .map(tag => tag[0]);  // We just want the word itself, not the label
}

// We're making our language understanding functions available for other parts of our program to use
module.exports = {
  analyzeSentiment,
  findNamedEntities
};