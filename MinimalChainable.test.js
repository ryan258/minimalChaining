// Import the MinimalChainable class we want to test
const MinimalChainable = require('./MinimalChainable');

// Import the fs module to mock file system operations
const fs = require('fs');

// Import the path module to handle file paths correctly across platforms
const path = require('path');

// Mock the fs module to avoid actual file system operations during tests
jest.mock('fs');

describe('MinimalChainable', () => {
  // Test the run method
  describe('run', () => {
    // This test checks if the run method correctly replaces placeholders in prompts
    test('replaces placeholders in prompts', async () => {
      const context = { hero: 'Alice', villain: 'Bob' };
      const model = 'test-model';
      const callable = jest.fn().mockResolvedValue('mocked response');
      const prompts = ['{{hero}} fights {{villain}}'];

      const [output, filledPrompts] = await MinimalChainable.run(context, model, callable, prompts);

      // Check if the placeholder was replaced correctly
      expect(filledPrompts[0]).toBe('Alice fights Bob');
      // Check if the callable function was called with the correct arguments
      expect(callable).toHaveBeenCalledWith('test-model', 'Alice fights Bob');
    });

    // This test verifies that previous responses are included in subsequent prompts
    test('includes previous responses in subsequent prompts', async () => {
      const context = {};
      const model = 'test-model';
      const callable = jest.fn()
        .mockResolvedValueOnce('First response')
        .mockResolvedValueOnce('Second response');
      const prompts = ['First prompt', 'Second prompt'];

      await MinimalChainable.run(context, model, callable, prompts);

      // Check if the second call to callable includes the first response
      expect(callable.mock.calls[1][1]).toContain('First response');
    });

    // This test checks if the method correctly handles JSON responses
    test('parses JSON responses', async () => {
      const context = {};
      const model = 'test-model';
      const callable = jest.fn().mockResolvedValue('```json\n{"key": "value"}\n```');
      const prompts = ['Test prompt'];

      const [output] = await MinimalChainable.run(context, model, callable, prompts);

      // Check if the JSON was correctly parsed
      expect(output[0]).toEqual({key: 'value'});
    });
  });

  // Test the toDelimTextFile method
  describe('toDelimTextFile', () => {
    // This test verifies that the method creates a file with the correct content
    test('creates a file with correct content', () => {
      // Mock the current date to have a consistent timestamp
      const mockDate = new Date('2023-01-01T00:00:00Z');
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

      const name = 'test';
      const content = ['Chapter 1', 'Chapter 2'];
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
      // Use path.join to create the expected file path
      const expectedFilePath = path.join('test-dir', 'test-2023-01-01-00-00-00.md');
      expect(fs.createWriteStream).toHaveBeenCalledWith(expectedFilePath);

      // Check if the correct content was written to the file
      expect(mockWriteStream.write).toHaveBeenCalledWith('## Chapter 1\n\n');
      expect(mockWriteStream.write).toHaveBeenCalledWith('Chapter 1');
      expect(mockWriteStream.write).toHaveBeenCalledWith('\n\n');
      expect(mockWriteStream.write).toHaveBeenCalledWith('## Chapter 2\n\n');
      expect(mockWriteStream.write).toHaveBeenCalledWith('Chapter 2');
      expect(mockWriteStream.write).toHaveBeenCalledWith('\n\n');

      // Check if the file stream was closed
      expect(mockWriteStream.end).toHaveBeenCalled();

      // Check if the method returns the correct result
      expect(result).toEqual({
        resultString: '## Chapter 1\n\nChapter 1\n\n## Chapter 2\n\nChapter 2\n\n',
        filePath: expectedFilePath
      });

      // Restore the original Date implementation
      jest.restoreAllMocks();
    });
  });
});