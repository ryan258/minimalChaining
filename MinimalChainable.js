const fs = require('fs');
const path = require('path');

class MinimalChainable {
  // This method is the heart of our AI chaining process
  static async run(context, model, callable, prompts) {
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
        const previousContext = output.slice(0, i).join("\n\n");
        prompt = `Previous story parts:\n\n${previousContext}\n\nNow, continue the story:\n${prompt}`;
      }

      contextFilledPrompts.push(prompt);  // We save our filled-in prompt

      // Now we ask our AI friend to respond to our prompt
      let result = await callable(model, prompt);

      // The AI might give us a JSON response, so we try to parse it
      // It's like trying to unwrap a present - sometimes it's easy, sometimes it's tricky!
      try {
        const jsonMatch = result.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
          result = JSON.parse(jsonMatch[1]);
        } else {
          result = JSON.parse(result);
        }
      } catch (error) {
        // If it's not JSON, we keep it as is - no harm done!
      }

      output.push(result);  // We add the AI's response to our collection
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
      // If our item is an object, we turn it into a string
      if (typeof item === 'object' && item !== null) {
        item = JSON.stringify(item);
      }
      // We add a header for each chapter
      const chainTextDelim = `## Chapter ${index + 1}\n\n`;
      writeStream.write(chainTextDelim);
      writeStream.write(item);
      writeStream.write('\n\n');
      resultString += chainTextDelim + item + '\n\n';
    });

    // We close our "book" (file)
    writeStream.end();
    // We return both the content as a string and the path where we saved the file
    return { resultString, filePath };
  }
}

module.exports = MinimalChainable;