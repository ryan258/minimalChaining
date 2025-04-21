import { promises as fs } from 'fs';
import path from 'path';

/**
 * MinimalChainable provides chaining logic for prompt-based AI workflows and utilities for saving results.
 */
export class MinimalChainable {
  /**
   * Chains prompts with context and model selection, invoking a callable at each step.
   * @param {Object} context - Key-value pairs for prompt replacement.
   * @param {Array|any} models - Array of models or single model to use per step.
   * @param {Function} callable - Async function to call with (prompt, schema, model).
   * @param {Array<string>} prompts - List of prompt templates.
   * @param {any} schema - Schema to pass to callable.
   * @returns {Promise<[Array, Array<string>]>} [output, contextFilledPrompts]
   * @throws {TypeError} If arguments are invalid.
   */
  static async run(context, models, callable, prompts, schema) {
    if (typeof callable !== 'function') throw new TypeError('callable must be a function');
    if (!Array.isArray(prompts)) throw new TypeError('prompts must be an array');
    if (Array.isArray(models) && models.length !== prompts.length) {
      throw new TypeError('models array length must match prompts length');
    }
    const output = [];
    const contextFilledPrompts = [];
    for (let i = 0; i < prompts.length; i++) {
      let prompt = prompts[i];
      for (const [key, value] of Object.entries(context || {})) {
        const placeholder = new RegExp(`\\{\\{${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\}\\}`, 'g');
        prompt = prompt.replace(placeholder, String(value));
      }
      if (i > 0) {
        const previousContext = output.slice(0, i).map(JSON.stringify).join("\n\n");
        prompt = `Previous story parts:\n\n${previousContext}\n\nNow, continue the story:\n${prompt}`;
      }
      contextFilledPrompts.push(prompt);
      const modelForStep = Array.isArray(models) ? models[i] : models;
      let result;
      try {
        result = await callable(prompt, schema, modelForStep);
      } catch (err) {
        throw new Error(`Error in callable at step ${i}: ${err.message}`);
      }
      output.push(result);
    }
    return [output, contextFilledPrompts];
  }

  /**
   * Writes content as delimited markdown chapters to a file (async).
   * @param {string} name - Base name for the file.
   * @param {Array} content - Array of objects to write as chapters.
   * @param {string} [directory='.'] - Directory to save the file in.
   * @returns {Promise<{resultString: string, filePath: string}>}
   * @throws {TypeError|Error} If input is invalid or file write fails.
   */
  static async toDelimTextFile(name, content, directory = '.') {
    if (typeof name !== 'string' || !name) throw new TypeError('name must be a non-empty string');
    if (!Array.isArray(content)) throw new TypeError('content must be an array');
    let resultString = '';
    const timestamp = new Date().toISOString().replace(/[:T]/g, '-').split('.')[0];
    const fileName = `${name}-${timestamp}.md`;
    const filePath = path.join(directory, fileName);
    try {
      await fs.mkdir(directory, { recursive: true });
      let fileContent = '';
      content.forEach((item, index) => {
        const itemString = JSON.stringify(item, null, 2);
        const chainTextDelim = `## Chapter ${index + 1}\n\n`;
        fileContent += chainTextDelim + itemString + '\n\n';
        resultString += chainTextDelim + itemString + '\n\n';
      });
      await fs.writeFile(filePath, fileContent, 'utf8');
    } catch (err) {
      throw new Error(`Failed to write file: ${err.message}`);
    }
    return { resultString, filePath };
  }
}