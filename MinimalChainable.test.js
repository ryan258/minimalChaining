import { jest, describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { MinimalChainable } from './MinimalChainable.js';
import fs from 'fs';
import path from 'path';

jest.mock('fs');

describe('MinimalChainable', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('run', () => {
    test('replaces placeholders in prompts', async () => {
      const context = { hero: 'Alice', villain: 'Bob' };
      const prompts = ['{{hero}} fights {{villain}}'];
      const models = 'test-model';
      const callable = jest.fn().mockResolvedValue('result');
      const [output, filledPrompts] = await MinimalChainable.run(context, models, callable, prompts);
      expect(filledPrompts[0]).toBe('Alice fights Bob');
      // Check if the callable function was called with the correct arguments
      expect(callable).toHaveBeenCalledWith('Alice fights Bob', undefined, 'test-model');
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
    test('creates a file with correct content', async () => {
      const name = 'test-story';
      const content = [
        { content: 'Once upon a time', mood: 'happy' },
        { content: 'The end', mood: 'sad' },
      ];
      const directory = '/tmp';
      const mockWriteFile = jest.spyOn(fs.promises, 'writeFile').mockResolvedValue();
      const mockMkdir = jest.spyOn(fs.promises, 'mkdir').mockResolvedValue();
      const result = await MinimalChainable.toDelimTextFile(name, content, directory);
      expect(mockMkdir).toHaveBeenCalledWith(directory, { recursive: true });
      expect(mockWriteFile).toHaveBeenCalled();
      expect(result.filePath).toContain(name);
      mockWriteFile.mockRestore();
      mockMkdir.mockRestore();
    });
  });
});