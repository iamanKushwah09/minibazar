const fs = require('fs');
const path = require('path');

/**
 * Converts a file or all files in a folder to Base64
 * @param {string} inputPath - Path to a file or folder
 * @returns {Object} - Object with filename: base64-encoded content
 */
function pathToBase64(inputPath) {
  const result = {};

  console.log(inputPath);
  if (!fs.existsSync(inputPath)) {
    console.error('Path does not exist: ' + inputPath);
    return { base64File: '', fileName: '' };
  }

  const stat = fs.statSync(inputPath);

  if (stat.isFile()) {
    const fileData = fs.readFileSync(inputPath);
    const fileName = path.basename(inputPath);
    result["base64File"] = fileData.toString('base64');
    result["fileName"] = fileName;
  } else if (stat.isDirectory()) {
    const files = fs.readdirSync(inputPath);
    files.forEach(file => {
      const filePath = path.join(inputPath, file);
      const fileStat = fs.statSync(filePath);

      if (fileStat.isFile()) {
        const fileData = fs.readFileSync(filePath);
        result["base64File"] = fileData.toString('base64');
        result["fileName"] = file;
      }
    });
  }

  return result;
}

module.exports = { pathToBase64 };
