const { asyncErrorHandler } = require('./errorUtils')

describe('errorUtils', () => {
  describe('asyncErrorHandler', () => {
    test('handles successful async function', async () => {
      const successFn = async () => 'success'
      const wrappedFn = asyncErrorHandler(successFn)
      await expect(wrappedFn()).resolves.toBe('success')
    })

    test('handles async function that throws an error', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      const errorFn = async () => {
        throw new Error('Test error')
      }
      const wrappedFn = asyncErrorHandler(errorFn)
      await wrappedFn()
      expect(consoleSpy).toHaveBeenCalledWith(
        '🚨 An error occurred:',
        expect.any(Error)
      )
      consoleSpy.mockRestore()
    })
  })
})
