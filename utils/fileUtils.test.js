import { jest, describe, test, expect, beforeEach, afterEach, beforeAll } from '@jest/globals';

await jest.unstable_mockModule('fs', () => ({
  __esModule: true,
  promises: {
    mkdir: jest.fn(),
    writeFile: jest.fn(),
  },
}));
const { promises: fs } = await import('fs');
let ensureDirectoryExists;
beforeAll(async () => {
  ({ ensureDirectoryExists } = await import('./fileUtils.js'));
});

describe('fileUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('ensureDirectoryExists', () => {
    test('creates directory if it does not exist', async () => {
      await ensureDirectoryExists('/test/dir');
      expect(fs.mkdir).toHaveBeenCalledWith('/test/dir', {
        recursive: true,
      });
    });
  });
});
