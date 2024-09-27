const fs = require('fs')
const { ensureDirectoryExists } = require('./fileUtils')

jest.mock('fs')

describe('fileUtils', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('ensureDirectoryExists', () => {
    test('creates directory if it does not exist', () => {
      ensureDirectoryExists('/test/dir')
      expect(fs.mkdirSync).toHaveBeenCalledWith('/test/dir', {
        recursive: true,
      })
    })
  })
})
