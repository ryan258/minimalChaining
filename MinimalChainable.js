// MinimalChainable.js

// We're bringing in some helpful tools to work with files and folders
const fs = require('fs').promises;  // Using promises for asynchronous file operations
const path = require('path');

/**
 * This is our main class that helps us chain AI interactions
 * Think of it like a factory that assembles a story piece by piece
 */
class MinimalChainable {
  /**
   * This is like setting up our factory with specific rules
   * @param {Object} options - Special instructions for how our factory should work
   */
  constructor(options = {}) {
    // Default options that can be overridden, like factory settings
    this.options = {
      maxContextSize: 5,  // Maximum number of previous responses to include in context, like remembering the last 5 parts of our story
      dateFormat: 'yyyy-MM-dd-HH-mm-ss',  // How we want to write the date on our story
      ...options  // This allows us to change these settings when we create a new MinimalChainable
    };
  }

  /**
   * This is the main assembly line of our story factory
   * It takes in the basic elements and produces a complete story
   * @param {Object} context - The basic setting of our story (like characters, place, etc.)
   * @param {string} model - The name of our AI storyteller
   * @param {Function} callable - The magic telephone to call our AI storyteller
   * @param {Array} prompts - The list of questions we want to ask our storyteller
   * @param {Object} schema - The rules for how our story should be structured
   * @returns {Promise<Array>} - The completed story and the questions we asked
   */
  async run(context, model, callable, prompts, schema) {
    const output = [];  // This will hold all the parts of our story
    const contextFilledPrompts = [];  // This will hold all the questions we asked

    // We're going to go through each of our questions one by one
    for (let i = 0; i < prompts.length; i++) {
      // We prepare our question, filling in any blanks and adding context from previous parts of the story
      const prompt = this.preparePrompt(prompts[i], context, output);
      contextFilledPrompts.push(prompt);  // We save our prepared question

      try {
        // We call our AI storyteller and wait for their response
        const result = await callable(prompt, schema);
        output.push(result);  // We add the new part of the story to our collection
      } catch (error) {
        // Oops! Something went wrong when we tried to call our storyteller
        console.error(`Error in AI call for prompt ${i}:`, error);
        // We add a blank page to our story to keep track of where we are
        output.push(null);
      }
    }

    // We return our completed story and all the questions we asked
    return [output, contextFilledPrompts];
  }

  /**
   * This is like preparing a question for our storyteller
   * We fill in any blanks and remind them of previous parts of the story
   * @param {string} prompt - The basic question we want to ask
   * @param {Object} context - The basic setting of our story
   * @param {Array} previousOutputs - All the previous parts of our story
   * @returns {string} - Our fully prepared question
   */
  preparePrompt(prompt, context, previousOutputs) {
    // First, we fill in any blanks in our question
    let preparedPrompt = this.replacePlaceholders(prompt, context);

    // Then, we remind our storyteller about recent parts of the story
    const relevantOutputs = previousOutputs.slice(-this.options.maxContextSize);
    if (relevantOutputs.length > 0) {
      const previousContext = relevantOutputs.map(this.stringifyOutput).join("\n\n");
      preparedPrompt = `Previous story parts:\n\n${previousContext}\n\nNow, continue the story:\n${preparedPrompt}`;
    }

    return preparedPrompt;
  }

  /**
   * This is like filling in the blanks in our question
   * @param {string} prompt - Our question with blanks
   * @param {Object} context - The information to fill in the blanks
   * @returns {string} - Our question with all blanks filled in
   */
  replacePlaceholders(prompt, context) {
    return prompt.replace(/\{\{(\w+)\}\}/g, (match, key) => 
      context.hasOwnProperty(key) ? String(context[key]) : match
    );
  }

  /**
   * This helps us turn any part of our story into a string
   * It's like making sure every page in our storybook is made of words, not complicated objects
   * @param {*} output - A part of our story
   * @returns {string} - That same part of the story, but definitely in words
   */
  stringifyOutput(output) {
    if (typeof output === 'object' && output !== null) {
      return JSON.stringify(output, null, 2);
    }
    return String(output);
  }

  /**
   * This helps us save our story to a file
   * It's like taking our story and writing it down in a real book
   * @param {string} name - The title of our story
   * @param {Array} content - All the parts of our story
   * @param {string} directory - Where we want to keep our storybook
   * @returns {Promise<Object>} - Information about our saved story
   */
  async toDelimTextFile(name, content, directory = '.') {
    let resultString = '';
    // We create a unique filename using the current date and time
    const timestamp = this.getFormattedDate();
    const fileName = `${name}-${timestamp}.md`;
    const filePath = path.join(directory, fileName);

    // We make sure our bookshelf (directory) exists - if not, we create it
    await fs.mkdir(directory, { recursive: true });

    // We're going to write each part of our story to the file
    for (let i = 0; i < content.length; i++) {
      const item = content[i];
      // We add a title for each chapter of our story
      const chapterTitle = `## Chapter ${i + 1}\n\n`;
      const chapterContent = this.stringifyOutput(item) + '\n\n';
      
      // We add this chapter to our whole story
      resultString += chapterTitle + chapterContent;
      
      // We write this chapter to our file
      await fs.appendFile(filePath, chapterTitle + chapterContent);
    }

    // We return information about our saved story
    return { resultString, filePath };
  }

  /**
   * This gives us today's date in a specific format
   * It's like writing the date on the cover of our storybook
   * @returns {string} - Today's date in our specified format
   */
  getFormattedDate() {
    const now = new Date();
    return now.toISOString().replace(/[:T]/g, '-').split('.')[0];
  }
}

// We're making our MinimalChainable class available for other parts of our program to use
module.exports = MinimalChainable;