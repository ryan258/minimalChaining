const fs = require('fs')
const path = require('path')

function ensureDirectoryExists(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true })
}

function writeTimestampedFile(baseName, content, directory = '.') {
  const timestamp = new Date().toISOString().replace(/[:T]/g, '-').split('.')[0]
  const fileName = `${baseName}-${timestamp}.md`
  const filePath = path.join(directory, fileName)

  ensureDirectoryExists(directory)

  let resultString = ''
  content.forEach((item, index) => {
    if (typeof item === 'object' && item !== null) {
      item = JSON.stringify(item)
    }
    const chainTextDelim = `## Chapter ${index + 1}\n\n`
    resultString += chainTextDelim + item + '\n\n'
  })

  fs.writeFileSync(filePath, resultString)
  return { resultString, filePath }
}

module.exports = {
  ensureDirectoryExists,
  writeTimestampedFile,
}
