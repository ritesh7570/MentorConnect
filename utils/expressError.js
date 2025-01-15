const logger = require("./logger")('expressError'); // Ensure the path to your logger is correct

class ExpressError extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;

    // Log error details, including the stack trace if available
    logger.error(`ExpressError created: StatusCode=${statusCode}, Message=${message}${this.stack ? `, StackTrace=${this.stack}` : ''}`);
  }
}

module.exports = ExpressError;
