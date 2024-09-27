// utils/fileUtils.js

// We're importing some tools to help us work with files and folders
const fs = require('fs')
const path = require('path')

// This function makes sure a folder exists. If it doesn't, it creates it!
// It's like checking if we have a toy box, and if we don't, we make one.
function ensureDirectoryExists(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true })
}

// This function writes our story to a file with a special name that includes the date and time
// It's like putting our story in a special envelope with today's date on it
function writeTimestampedFile(baseName, content, directory = '.') {
  // First, we create a special timestamp. It's like writing the date and time on our envelope
  const timestamp = new Date().toISOString().replace(/[:T]/g, '-').split('.')[0]
  const fileName = `${baseName}-${timestamp}.md`
  const filePath = path.join(directory, fileName)

  // We make sure our special folder exists
  ensureDirectoryExists(directory)

  // We prepare our story to be written
  let resultString = ''

  // We check if our content is an array (like a list of story parts)
  if (Array.isArray(content)) {
    // If it is, we go through each part of our story
    content.forEach((item, index) => {
      // If a part of our story is an object, we turn it into a string
      if (typeof item === 'object' && item !== null) {
        item = JSON.stringify(item)
      }
      // We add a title for each chapter of our story, but only once
      const chapterHeader = `## Chapter ${index + 1}\n\n`
      resultString += chapterHeader + item + '\n\n'
    })
  } else {
    // If our content isn't a list, we just use it as is
    resultString = content
  }

  // Now we write our story to our special file
  fs.writeFileSync(filePath, resultString)
  
  // We return information about our saved story
  return { resultString, filePath }
}

// We're making these functions available for other parts of our program to use
module.exports = {
  ensureDirectoryExists,
  writeTimestampedFile,
}