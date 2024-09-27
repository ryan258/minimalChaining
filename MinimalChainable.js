const fs = require('fs');
const path = require('path');

class MinimalChainable {
  static async run(context, model, callable, prompts) {
    const output = [];
    const contextFilledPrompts = [];

    for (let i = 0; i < prompts.length; i++) {
      let prompt = prompts[i];

      // Fill in context variables
      for (const [key, value] of Object.entries(context)) {
        const placeholder = `{{${key}}}`;
        prompt = prompt.replace(new RegExp(placeholder, 'g'), String(value));
      }

      // Add previous outputs to the prompt
      if (i > 0) {
        const previousContext = output.slice(0, i).join("\n\n");
        prompt = `Previous story parts:\n\n${previousContext}\n\nNow, continue the story:\n${prompt}`;
      }

      contextFilledPrompts.push(prompt);

      let result = await callable(model, prompt);

      try {
        const jsonMatch = result.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
          result = JSON.parse(jsonMatch[1]);
        } else {
          result = JSON.parse(result);
        }
      } catch (error) {
        // Not JSON, keep as is
      }

      output.push(result);
    }

    return [output, contextFilledPrompts];
  }

  static toDelimTextFile(name, content) {
    let resultString = '';
    const writeStream = fs.createWriteStream(`${name}.txt`);

    content.forEach((item, index) => {
      if (typeof item === 'object' && item !== null) {
        item = JSON.stringify(item);
      }
      const chainTextDelim = `${'🔗'.repeat(index + 1)} -------- Magic Answer #${index + 1} -------------\n\n`;
      writeStream.write(chainTextDelim);
      writeStream.write(item);
      writeStream.write('\n\n');
      resultString += chainTextDelim + item + '\n\n';
    });

    writeStream.end();
    return resultString;
  }
}

module.exports = MinimalChainable;