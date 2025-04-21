// fileSystemTool.js

// We're bringing in a special helper that knows all about files and folders
import { promises as fs } from 'fs';  // This is like a file organizer that can work really fast!

/**
 * This is our magic function that can read files for our AI friend
 * @param {string} filePath - This is the secret map to find our file
 * @return {Promise<string>} - This is the magic spell (Promise) that will give us the file's content
 */
export async function readFile(filePath) {
  try {
    // We're asking our file organizer to read the file for us
    return await fs.readFile(filePath, 'utf8');
  } catch (error) {
    // Uh-oh! If we can't find or read the file, we'll let our AI friend know
    console.error('Oops! Something went wrong while trying to read the file:', error.message);
    return `I couldn't read the file because: ${error.message}`;
  }
}

/**
 * This is our magic function that can write files for our AI friend
 * @param {string} filePath - This is where we want to save our new file
 * @param {string} content - This is what we want to write in our file
 * @return {Promise<string>} - This is the magic spell (Promise) that will tell us if the writing was successful
 */
export async function writeFile(filePath, content) {
  try {
    // We're asking our file organizer to write the new file for us
    await fs.writeFile(filePath, content, 'utf8');
    return `Hooray! I successfully wrote to the file at ${filePath}`;
  } catch (error) {
    // Uh-oh! If we can't write the file, we'll let our AI friend know
    console.error('Oops! Something went wrong while trying to write the file:', error.message);
    return `I couldn't write the file because: ${error.message}`;
  }
}