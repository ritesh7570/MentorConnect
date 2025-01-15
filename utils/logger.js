const winston = require('winston');
const fs = require('fs');
const path = require('path');
const DailyRotateFile = require('winston-daily-rotate-file');

// Define the log directory and file paths
const logDirectory = path.join(__dirname, '../logs');
const logFilePath = path.join(logDirectory, 'application-%DATE%.log');

// Ensure the logs directory exists
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

// Function to get current IST time with only HH:mm:ss
const getISTTimestamp = () => {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
  const istTime = new Date(now.getTime() + istOffset);
  return istTime.toISOString().split('T')[1].split('.')[0]; // Only return HH:mm:ss
};

// Define custom levels
const customLevels = {
  levels: {
    app: 0,
    xpress: 1,
    routes: 2,
    db: 3,
    mware: 4,
    info: 5,
    warn: 6,
    error: 7,
    debug: 8,
    http: 9
  },
  colors: {
    app: 'blue',
    xpress: 'green',
    routes: 'yellow',
    db: 'magenta',
    mware: 'cyan',
    info: 'green',
    warn: 'yellow',
    error: 'red',
    debug: 'blue',
    http: 'magenta'
  }
};

// Define custom format for console and file outputs
const myFormat = winston.format.printf(({ level, message, timestamp, label, stack }) => {
  const shortLevel = customLevels.levels[level] !== undefined ? level.toUpperCase() : level;

  return `${timestamp} [${label || 'app'}] ${shortLevel}: ${message}${stack ? `\n${stack}` : ''}`;
});

// Configure the daily rotate file transport
const transport = new DailyRotateFile({
  filename: logFilePath,
  datePattern: 'YYYY-MM-DD',
  maxSize: '2m',
  maxFiles: '2d',
  zippedArchive: true,
});

// Create the logger instance
const logger = winston.createLogger({
  levels: customLevels.levels,
  format: winston.format.combine(
    winston.format.timestamp({ format: getISTTimestamp }), // Updated timestamp format
    winston.format.colorize(),
    myFormat
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({ format: getISTTimestamp }), // Updated timestamp format
        winston.format.colorize(),
        myFormat
      )
    }),
    transport  // For file output with rotation
  ],
});

// Apply color coding for custom levels
winston.addColors(customLevels.colors);

// Export logger and helper method for setting labels dynamically
module.exports = (label = 'app') => logger.child({ label });
