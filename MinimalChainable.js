const fs = require('fs');
const path = require('path');

class MinimalChainable {
  // This method is the heart of our AI chaining process
  static async run(context, model, callable, prompts, schema) {
    const output = [];  // This will store all our AI responses
    const contextFilledPrompts = [];  // This will store our prompts after filling in the context

    // We loop through each prompt, kind of like going through a storybook page by page
    for (let i = 0; i < prompts.length; i++) {
      let prompt = prompts[i];

      // Here, we're replacing placeholders in our prompt with actual values
      // It's like filling in the blanks in a Mad Libs game!
      for (const [key, value] of Object.entries(context)) {
        const placeholder = `{{${key}}}`;
        prompt = prompt.replace(new RegExp(placeholder, 'g'), String(value));
      }

      // If this isn't our first prompt, we add previous responses to give context
      // It's like reminding the AI of what happened in earlier chapters of our story
      if (i > 0) {
        const previousContext = output.slice(0, i).map(JSON.stringify).join("\n\n");
        prompt = `Previous story parts:\n\n${previousContext}\n\nNow, continue the story:\n${prompt}`;
      }

      contextFilledPrompts.push(prompt);  // We save our filled-in prompt

      // Now we ask our AI friend to respond to our prompt
      let result = await callable(prompt, schema);

      // The AI gives us a structured response, so we don't need to parse it
      output.push(result);
    }

    // We return both the AI's responses and our filled-in prompts
    return [output, contextFilledPrompts];
  }

  // This method helps us save our story to a file
  static toDelimTextFile(name, content, directory = '.') {
    let resultString = '';
    // We create a unique filename using the current date and time
    const timestamp = new Date().toISOString().replace(/[:T]/g, '-').split('.')[0];
    const fileName = `${name}-${timestamp}.md`;
    const filePath = path.join(directory, fileName);

    // We make sure our directory exists - if not, we create it
    fs.mkdirSync(directory, { recursive: true });

    // We open a stream to write our file - it's like opening a book to write in
    const writeStream = fs.createWriteStream(filePath);

    // We go through each part of our content (like chapters in a book)
    content.forEach((item, index) => {
      // Our item is already an object, so we just turn it into a string
      const itemString = JSON.stringify(item, null, 2);
      // We add a header for each chapter
      const chainTextDelim = `## Chapter ${index + 1}\n\n`;
      writeStream.write(chainTextDelim);
      writeStream.write(itemString);
      writeStream.write('\n\n');
      resultString += chainTextDelim + itemString + '\n\n';
    });

    // We close our "book" (file)
    writeStream.end();
    // We return both the content as a string and the path where we saved the file
    return { resultString, filePath };
  }
}

module.exports = MinimalChainable;