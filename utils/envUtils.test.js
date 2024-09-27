const { getEnvVariable } = require('./envUtils')

describe('envUtils', () => {
  describe('getEnvVariable', () => {
    const OLD_ENV = process.env

    beforeEach(() => {
      jest.resetModules()
      process.env = { ...OLD_ENV }
    })

    afterAll(() => {
      process.env = OLD_ENV
    })

    test('returns value of existing environment variable', () => {
      process.env.TEST_VAR = 'test value'
      expect(getEnvVariable('TEST_VAR')).toBe('test value')
    })

    test('throws error for non-existent environment variable', () => {
      expect(() => getEnvVariable('NON_EXISTENT_VAR')).toThrow(
        'Environment variable NON_EXISTENT_VAR is not set'
      )
    })
  })
})
