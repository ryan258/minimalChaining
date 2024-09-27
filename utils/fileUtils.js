// utils/fileUtils.js

const fs = require('fs');
const path = require('path');

/**
 * Ensures a directory exists, creating it if necessary.
 * @param {string} dirPath - The directory path to ensure.
 */
function ensureDirectoryExists(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

/**
 * Writes content to a file with a timestamp in the filename.
 * @param {string} baseName - The base name for the file.
 * @param {string} content - The content to write.
 * @param {string} directory - The directory to save the file in.
 * @returns {string} The path of the created file.
 */
function writeTimestampedFile(baseName, content, directory) {
  const timestamp = new Date().toISOString().replace(/[:T]/g, '-').split('.')[0];
  const fileName = `${baseName}-${timestamp}.md`;
  const filePath = path.join(directory, fileName);

  ensureDirectoryExists(directory);
  fs.writeFileSync(filePath, content);

  return filePath;
}

module.exports = {
  ensureDirectoryExists,
  writeTimestampedFile
};