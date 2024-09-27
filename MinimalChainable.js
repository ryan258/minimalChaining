// 🌟 Welcome to the Magical World of Coding! 🌟

// First, we need to bring in some special tools to help us work with files 📁
const fs = require('fs');
const path = require('path');

// 🧙‍♂️ Let's create a magical class called MinimalChainable 🧙‍♂️
class MinimalChainable {
  // 🔮 This class helps us talk to a smart computer friend and remember what it says 🔮

  // 🚀 Our main magical spell (function) that does all the cool stuff 🚀
  static async run(context, model, callable, prompts) {
    // 📦 We'll store our results in these magical boxes 📦
    const output = [];
    const contextFilledPrompts = [];

    // 🔄 Let's go through each of our questions (prompts) one by one 🔄
    for (let i = 0; i < prompts.length; i++) {
      let prompt = prompts[i];

      // 🔍 First, we look for any blanks in our question and fill them in 🔍
      for (const [key, value] of Object.entries(context)) {
        const placeholder = `{{${key}}}`;
        prompt = prompt.replace(new RegExp(placeholder, 'g'), String(value));
      }

      // 🧠 Now, we use answers from before to help with our current question 🧠
      for (let j = i; j > 0; j--) {
        const previousOutput = output[i - j];

        // 📚 If the previous answer was like a book with many pages...
        if (typeof previousOutput === 'object' && previousOutput !== null) {
          // 📖 We might want to look at the whole book
          const fullRefPlaceholder = `{{output[-${j}]}}`;
          prompt = prompt.replace(new RegExp(fullRefPlaceholder, 'g'), JSON.stringify(previousOutput));

          // 📑 Or just specific pages from the book
          for (const [key, value] of Object.entries(previousOutput)) {
            const propRefPlaceholder = `{{output[-${j}].${key}}}`;
            prompt = prompt.replace(new RegExp(propRefPlaceholder, 'g'), String(value));
          }
        } else {
          // 📝 If it was just a simple note, we use it as is
          const refPlaceholder = `{{output[-${j}]}}`;
          prompt = prompt.replace(new RegExp(refPlaceholder, 'g'), String(previousOutput));
        }
      }

      // 📝 We write down our filled-in question
      contextFilledPrompts.push(prompt);

      // 🤖 Now we ask our smart computer friend the question
      let result = await callable(model, prompt);

      // 🧐 Let's try to understand the answer - is it a simple note or a complex book?
      try {
        // 🔎 First, we look for any special markings that might show where the important info is
        const jsonMatch = result.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
          // 📚 If we find these markings, we treat it like a book with many pages
          result = JSON.parse(jsonMatch[1]);
        } else {
          // 📖 If not, we try to read the whole thing as a book
          result = JSON.parse(result);
        }
      } catch (error) {
        // 📝 If that doesn't work, we just treat it like a simple note
      }

      // 📥 We put the answer in our magical result box
      output.push(result);
    }

    // 🎉 We're done! Let's return all our questions and answers
    return [output, contextFilledPrompts];
  }

  // 📝 This magical spell helps us write down all our results in a special file 📝
  static toDelimTextFile(name, content) {
    let resultString = '';

    // 📂 We open a magical book to write in
    const writeStream = fs.createWriteStream(`${name}.txt`);

    // ✍️ We go through each of our answers and write them down
    content.forEach((item, index) => {
      // 🔄 If the answer is complex, we turn it into a simple note
      if (typeof item === 'object' && item !== null) {
        item = JSON.stringify(item);
      }

      // 🎨 We make a pretty decoration for each answer
      const chainTextDelim = `${'🔗'.repeat(index + 1)} -------- Magic Answer #${index + 1} -------------\n\n`;

      // 📝 We write the decoration and the answer in our book
      writeStream.write(chainTextDelim);
      writeStream.write(item);
      writeStream.write('\n\n');

      // 🖨️ We also keep a copy of what we wrote
      resultString += chainTextDelim + item + '\n\n';
    });

    // 📚 We close our magical book
    writeStream.end();

    // 🔙 We return everything we wrote as one big magical scroll
    return resultString;
  }
}

// 🚀 We pack up our magical MinimalChainable so others can use it too!
module.exports = MinimalChainable;

// 🎉 Congratulations! You've just created a magical tool to talk to smart computers! 🎉