import { jest, describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { asyncErrorHandler } from './errorUtils.js';

describe('errorUtils', () => {
  describe('asyncErrorHandler', () => {
    test('handles async function that throws an error', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const errorFn = async () => {
        throw new Error('Test error');
      };
      const wrappedFn = asyncErrorHandler(errorFn);
      await expect(wrappedFn()).resolves.toBeUndefined();
      const calledWith = consoleSpy.mock.calls[0][0];
      expect(
        calledWith === 'Test error' || (calledWith instanceof Error && calledWith.message === 'Test error')
      ).toBeTruthy();
      consoleSpy.mockRestore();
    });
  });
});
