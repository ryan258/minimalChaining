// utils/envUtils.js

import dotenv from 'dotenv';
dotenv.config();

/**
 * Gets an environment variable, throwing an error if it's not set.
 * @param {string} key - The name of the environment variable.
 * @returns {string} The value of the environment variable.
 */
export function getEnvVariable(key) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
}