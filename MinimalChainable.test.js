// MinimalChainable.test.js

// First, we need to import the class we want to test
const MinimalChainable = require('./MinimalChainable');

// We also need to import the file system module to mock it
const fs = require('fs').promises;

// We're going to pretend to be the file system module
jest.mock('fs', () => ({
  promises: {
    mkdir: jest.fn(),
    appendFile: jest.fn(),
  }
}));

// This is where our tests begin!
describe('MinimalChainable', () => {
  // Before each test, we create a fresh MinimalChainable object
  let minimalChainable;
  beforeEach(() => {
    minimalChainable = new MinimalChainable();
  });

  // After each test, we clean up any mocks
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Let's test the constructor
  describe('constructor', () => {
    test('sets default options', () => {
      expect(minimalChainable.options.maxContextSize).toBe(5);
      expect(minimalChainable.options.dateFormat).toBe('yyyy-MM-dd-HH-mm-ss');
    });

    test('allows overriding default options', () => {
      const customOptions = { maxContextSize: 10, dateFormat: 'yyyy-MM-dd' };
      const customMinimalChainable = new MinimalChainable(customOptions);
      expect(customMinimalChainable.options.maxContextSize).toBe(10);
      expect(customMinimalChainable.options.dateFormat).toBe('yyyy-MM-dd');
    });
  });

  // Now let's test the run method
  describe('run', () => {
    test('processes prompts and returns results', async () => {
      const context = { character: 'Alice' };
      const model = 'test-model';
      const callable = jest.fn().mockResolvedValue({ content: 'Test response' });
      const prompts = ['Tell a story about {{character}}', 'Continue the story'];
      const schema = {};

      const [output, contextFilledPrompts] = await minimalChainable.run(context, model, callable, prompts, schema);

      expect(output).toEqual([{ content: 'Test response' }, { content: 'Test response' }]);
      expect(contextFilledPrompts[0]).toBe('Tell a story about Alice');
      expect(contextFilledPrompts[1]).toContain('Continue the story');
      expect(callable).toHaveBeenCalledTimes(2);
    });

    test('handles errors in AI calls', async () => {
      const callable = jest.fn()
        .mockResolvedValueOnce({ content: 'Success' })
        .mockRejectedValueOnce(new Error('AI Error'));

      const [output, _] = await minimalChainable.run({}, 'model', callable, ['Prompt 1', 'Prompt 2'], {});

      expect(output).toEqual([{ content: 'Success' }, null]);
    });
  });

  // Let's test the preparePrompt method
  describe('preparePrompt', () => {
    test('replaces placeholders and adds context', () => {
      const prompt = 'Hello, {{name}}!';
      const context = { name: 'Alice' };
      const previousOutputs = [{ content: 'Previous story' }];

      const result = minimalChainable.preparePrompt(prompt, context, previousOutputs);

      expect(result).toContain('Hello, Alice!');
      expect(result).toContain('Previous story');
    });
  });

  // Let's test the replacePlaceholders method
  describe('replacePlaceholders', () => {
    test('replaces all placeholders in the prompt', () => {
      const prompt = 'Hello, {{name}}! Welcome to {{place}}.';
      const context = { name: 'Alice', place: 'Wonderland' };

      const result = minimalChainable.replacePlaceholders(prompt, context);

      expect(result).toBe('Hello, Alice! Welcome to Wonderland.');
    });

    test('leaves unknown placeholders unchanged', () => {
      const prompt = 'Hello, {{name}}! Your age is {{age}}.';
      const context = { name: 'Bob' };

      const result = minimalChainable.replacePlaceholders(prompt, context);

      expect(result).toBe('Hello, Bob! Your age is {{age}}.');
    });
  });

  // Let's test the stringifyOutput method
  describe('stringifyOutput', () => {
    test('stringifies objects', () => {
      const output = { key: 'value' };
      const result = minimalChainable.stringifyOutput(output);
      expect(result).toBe('{\n  "key": "value"\n}');
    });

    test('returns strings unchanged', () => {
      const output = 'Hello, World!';
      const result = minimalChainable.stringifyOutput(output);
      expect(result).toBe('Hello, World!');
    });
  });

  // Finally, let's test the toDelimTextFile method
  describe('toDelimTextFile', () => {
    test('writes content to a file', async () => {
      const name = 'test-story';
      const content = [{ chapter: 'Chapter 1' }, { chapter: 'Chapter 2' }];
      const directory = 'test-dir';

      const result = await minimalChainable.toDelimTextFile(name, content, directory);

      expect(fs.mkdir).toHaveBeenCalledWith(directory, { recursive: true });
      expect(fs.appendFile).toHaveBeenCalledTimes(2);
      expect(result).toHaveProperty('resultString');
      expect(result).toHaveProperty('filePath');
    });
  });
});