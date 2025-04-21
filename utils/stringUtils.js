// utils/stringUtils.js

/**
 * Replaces placeholders in a string with values from an object.
 * @param {string} str - The string with placeholders.
 * @param {Object} context - An object with keys matching the placeholders.
 * @returns {string} The string with placeholders replaced.
 */
export function replacePlaceholders(str, context) {
  return str.replace(/\{\{(.*?)\}\}/g, (_, key) => context[key] || '');
}