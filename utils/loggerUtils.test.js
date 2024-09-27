const { log, logError } = require('./loggerUtils')

describe('loggerUtils', () => {
  let consoleLogSpy
  let consoleErrorSpy

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation()
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
  })

  afterEach(() => {
    consoleLogSpy.mockRestore()
    consoleErrorSpy.mockRestore()
  })

  describe('log', () => {
    test('logs message with default emoji', () => {
      log('Test message')
      expect(consoleLogSpy).toHaveBeenCalledWith('📢 Test message')
    })

    test('logs message with custom emoji', () => {
      log('Test message', '🌟')
      expect(consoleLogSpy).toHaveBeenCalledWith('🌟 Test message')
    })
  })

  describe('logError', () => {
    test('logs error message without error object', () => {
      logError('Test error')
      expect(consoleErrorSpy).toHaveBeenCalledWith('🚨 Test error')
    })

    test('logs error message with error object', () => {
      const error = new Error('Test error object')
      logError('Test error', error)
      expect(consoleErrorSpy).toHaveBeenCalledWith('🚨 Test error')
      expect(consoleErrorSpy).toHaveBeenCalledWith(error)
    })
  })
})
