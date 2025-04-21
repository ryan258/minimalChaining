// utils/loggerUtils.js

/**
 * Logs a message with an emoji prefix.
 * @param {string} message - The message to log.
 * @param {string} emoji - The emoji to prefix the message with.
 */
export function log(message, emoji = '📢') {
    console.log(`${emoji} ${message}`);
  }
  
  /**
   * Logs an error message.
   * @param {string} message - The error message to log.
   * @param {Error} [error] - The error object, if available.
   */
  export function logError(message, error) {
    console.error(`🚨 ${message}`);
    if (error) console.error(error);
  }