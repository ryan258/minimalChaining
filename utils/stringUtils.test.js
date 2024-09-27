const { replacePlaceholders } = require('./stringUtils')

describe('stringUtils', () => {
  describe('replacePlaceholders', () => {
    test('replaces single placeholder', () => {
      const template = 'Hello, {{name}}!'
      const values = { name: 'Alice' }
      expect(replacePlaceholders(template, values)).toBe('Hello, Alice!')
    })

    test('replaces multiple placeholders', () => {
      const template = '{{greeting}}, {{name}}! Welcome to {{place}}.'
      const values = { greeting: 'Hello', name: 'Bob', place: 'Wonderland' }
      expect(replacePlaceholders(template, values)).toBe(
        'Hello, Bob! Welcome to Wonderland.'
      )
    })

    test('ignores unknown placeholders', () => {
      const template = 'Hello, {{name}}! Your age is {{age}}.'
      const values = { name: 'Charlie' }
      expect(replacePlaceholders(template, values)).toBe(
        'Hello, Charlie! Your age is .'
      )
    })

    test('handles empty values object', () => {
      const template = 'Hello, {{name}}!'
      const values = {}
      expect(replacePlaceholders(template, values)).toBe('Hello, !')
    })

    test('returns original string if no placeholders', () => {
      const template = 'Hello, world!'
      const values = { name: 'Dave' }
      expect(replacePlaceholders(template, values)).toBe('Hello, world!')
    })
  })
})
