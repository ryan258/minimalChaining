// utils/stringUtils.js

/**
 * Replaces placeholders in a string with values from an object.
 * @param {string} str - The string with placeholders.
 * @param {Object} values - An object with keys matching the placeholders.
 * @returns {string} The string with placeholders replaced.
 */
function replacePlaceholders(str, values) {
    return str.replace(/\{\{(\w+)\}\}/g, (_, key) => values[key] || '');
  }
  
  module.exports = {
    replacePlaceholders
  };