# Utility Modules Documentation

This document provides detailed information about the utility modules used in the MinimalChaining project. Each module is designed to handle specific tasks, making the main application code cleaner and more modular.

## Table of Contents

1. [aiUtils.js](#aiutilsjs)
2. [envUtils.js](#envutilsjs)
3. [errorUtils.js](#errorutilsjs)
4. [fileUtils.js](#fileutilsjs)
5. [loggerUtils.js](#loggerutilsjs)
6. [stringUtils.js](#stringutilsjs)

## aiUtils.js

This module handles interactions with AI models.

### Functions

#### `askAI(apiUrl, modelName, prompt)`

Sends a prompt to the AI model and returns the response.

- Parameters:
  - `apiUrl` (string): The URL of the AI API.
  - `modelName` (string): The name of the AI model to use.
  - `prompt` (string): The prompt to send to the AI.
- Returns: Promise<string> - The AI's response.

Example usage:
```javascript
const { askAI } = require('./utils/aiUtils');

const response = await askAI('http://localhost:11434/api/generate', 'llama3.1:latest', 'Tell me a joke');
console.log(response);
```

## envUtils.js

This module manages environment variables.

### Functions

#### `getEnvVariable(key)`

Gets an environment variable, throwing an error if it's not set.

- Parameters:
  - `key` (string): The name of the environment variable.
- Returns: string - The value of the environment variable.
- Throws: Error if the environment variable is not set.

Example usage:
```javascript
const { getEnvVariable } = require('./utils/envUtils');

const apiUrl = getEnvVariable('API_URL');
console.log(`API URL: ${apiUrl}`);
```

## errorUtils.js

This module provides error handling utilities.

### Functions

#### `asyncErrorHandler(fn)`

Wraps an async function to catch and handle errors.

- Parameters:
  - `fn` (Function): The async function to wrap.
- Returns: Function - The wrapped function.

Example usage:
```javascript
const { asyncErrorHandler } = require('./utils/errorUtils');

const safeAsyncFunction = asyncErrorHandler(async () => {
  // Your async code here
});

safeAsyncFunction().catch(error => console.error('Caught error:', error));
```

## fileUtils.js

This module handles file operations.

### Functions

#### `ensureDirectoryExists(dirPath)`

Ensures a directory exists, creating it if necessary.

- Parameters:
  - `dirPath` (string): The directory path to ensure.

#### `writeTimestampedFile(baseName, content, directory)`

Writes content to a file with a timestamp in the filename.

- Parameters:
  - `baseName` (string): The base name for the file.
  - `content` (string): The content to write.
  - `directory` (string): The directory to save the file in.
- Returns: string - The path of the created file.

Example usage:
```javascript
const { writeTimestampedFile } = require('./utils/fileUtils');

const filePath = writeTimestampedFile('story', 'Once upon a time...', './output');
console.log(`File saved at: ${filePath}`);
```

## loggerUtils.js

This module provides logging functionality.

### Functions

#### `log(message, emoji = '📢')`

Logs a message with an emoji prefix.

- Parameters:
  - `message` (string): The message to log.
  - `emoji` (string, optional): The emoji to prefix the message with. Default is '📢'.

#### `logError(message, error)`

Logs an error message.

- Parameters:
  - `message` (string): The error message to log.
  - `error` (Error, optional): The error object, if available.

Example usage:
```javascript
const { log, logError } = require('./utils/loggerUtils');

log('Operation successful!', '✅');
logError('An error occurred', new Error('Something went wrong'));
```

## stringUtils.js

This module provides string manipulation functions.

### Functions

#### `replacePlaceholders(str, values)`

Replaces placeholders in a string with values from an object.

- Parameters:
  - `str` (string): The string with placeholders.
  - `values` (Object): An object with keys matching the placeholders.
- Returns: string - The string with placeholders replaced.

Example usage:
```javascript
const { replacePlaceholders } = require('./utils/stringUtils');

const template = 'Hello, {{name}}! Welcome to {{place}}.';
const values = { name: 'Alice', place: 'Wonderland' };
const result = replacePlaceholders(template, values);
console.log(result); // Output: Hello, Alice! Welcome to Wonderland.
```

---

These utility modules provide a range of helpful functions to streamline development in the MinimalChaining project. By using these utilities, you can keep your main application code clean and focused on core functionality while leveraging these reusable components for common tasks.