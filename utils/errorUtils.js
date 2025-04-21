// utils/errorUtils.js

/**
 * Wraps an async function to catch and handle errors.
 * @param {Function} fn - The async function to wrap.
 * @returns {Function} The wrapped function.
 */
export function asyncErrorHandler(fn) {
  return async function(...args) {
    try {
      return await fn(...args);
    } catch (err) {
      console.error(err);
    }
  };
}