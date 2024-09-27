// utils/errorUtils.js

/**
 * Wraps an async function to catch and handle errors.
 * @param {Function} fn - The async function to wrap.
 * @returns {Function} The wrapped function.
 */
function asyncErrorHandler(fn) {
    return async function(...args) {
      try {
        return await fn(...args);
      } catch (error) {
        console.error('🚨 An error occurred:', error);
        // You could add more error handling logic here, like sending to a monitoring service
      }
    };
  }
  
  module.exports = {
    asyncErrorHandler
  };