const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Ensure the logs directory exists
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Function to generate a log file name based on the current date
const getLogFileName = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const day = String(today.getDate()).padStart(2, '0');
  return `${day}-${month}-${year}.log`; // e.g., app-2024-10-23.log
};

// Define the log file path based on the current date
const logPath = path.join(logsDir, getLogFileName());

// Create a logger instance with file and console transports
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.File({ filename: logPath }),   // Log to date-based file
    new winston.transports.Console()                      // Log to console
  ],
});

// Export the logger instance to use in other parts of the application
module.exports = logger;
