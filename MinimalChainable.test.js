const MinimalChainable = require('./MinimalChainable');
const fs = require('fs');
const path = require('path');  // Add this line to import the path module

jest.mock('fs');

describe('MinimalChainable', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('run', () => {
    test('replaces placeholders in prompts', async () => {
      const context = { hero: 'Alice', villain: 'Bob' };
      const model = 'test-model';
      const callable = jest.fn().mockResolvedValue({ content: 'mocked response', mood: 'happy' });
      const prompts = ['{{hero}} fights {{villain}}'];

      const [output, filledPrompts] = await MinimalChainable.run(context, model, callable, prompts);

      // Check if the placeholder was replaced correctly
      expect(filledPrompts[0]).toBe('Alice fights Bob');
      // Check if the callable function was called with the correct arguments
      expect(callable).toHaveBeenCalledWith('Alice fights Bob', undefined);
    });

    test('includes previous responses in subsequent prompts', async () => {
      const context = {};
      const model = 'test-model';
      const callable = jest.fn()
        .mockResolvedValueOnce({ content: 'First response', mood: 'happy' })
        .mockResolvedValueOnce({ content: 'Second response', mood: 'excited' });
      const prompts = ['First prompt', 'Second prompt'];

      await MinimalChainable.run(context, model, callable, prompts);

      // Check if the second call to callable includes the first response
      expect(callable.mock.calls[1][0]).toContain('First response');
    });

    test('returns structured responses', async () => {
      const context = {};
      const model = 'test-model';
      const callable = jest.fn().mockResolvedValue({ content: 'Test content', mood: 'happy' });
      const prompts = ['Test prompt'];

      const [output] = await MinimalChainable.run(context, model, callable, prompts);

      // Check if the output is the structured response
      expect(output[0]).toEqual({ content: 'Test content', mood: 'happy' });
    });
  });

  describe('toDelimTextFile', () => {
    test('creates a file with correct content', () => {
      // Mock the current date to have a consistent timestamp
      const mockDate = new Date('2023-01-01T00:00:00Z');
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

      const name = 'test';
      const content = [
        { content: 'Chapter 1 content', mood: 'happy' },
        { content: 'Chapter 2 content', mood: 'excited' }
      ];
      const directory = 'test-dir';

      // Mock the file write stream
      const mockWriteStream = {
        write: jest.fn(),
        end: jest.fn()
      };
      fs.createWriteStream.mockReturnValue(mockWriteStream);

      const result = MinimalChainable.toDelimTextFile(name, content, directory);

      // Check if the directory was created
      expect(fs.mkdirSync).toHaveBeenCalledWith(directory, { recursive: true });

      // Check if the file was created with the correct name
      const expectedFilePath = path.join('test-dir', 'test-2023-01-01-00-00-00.md');
      expect(fs.createWriteStream).toHaveBeenCalledWith(expectedFilePath);

      // Check if the correct content was written to the file
      expect(mockWriteStream.write).toHaveBeenCalledWith('## Chapter 1\n\n');
      expect(mockWriteStream.write).toHaveBeenCalledWith(JSON.stringify({ content: 'Chapter 1 content', mood: 'happy' }, null, 2));
      expect(mockWriteStream.write).toHaveBeenCalledWith('\n\n');
      expect(mockWriteStream.write).toHaveBeenCalledWith('## Chapter 2\n\n');
      expect(mockWriteStream.write).toHaveBeenCalledWith(JSON.stringify({ content: 'Chapter 2 content', mood: 'excited' }, null, 2));
      expect(mockWriteStream.write).toHaveBeenCalledWith('\n\n');

      // Check if the file stream was closed
      expect(mockWriteStream.end).toHaveBeenCalled();

      // Check if the method returns the correct result
      expect(result).toEqual({
        resultString: expect.stringContaining('Chapter 1 content'),
        filePath: expectedFilePath
      });

      // Restore the original Date implementation
      jest.restoreAllMocks();
    });
  });
});