const logger = require("./logger")('utilsWrapAsync'); // Specify label // Assuming logger is in the same utils folder

module.exports = (fn) => {
  return (req, res, next) => {
    // logger.info("======= [MIDDLEWARE: wrapAsync] =======");
    // logger.info(`[ACTION: Wrapping async function: ${fn.name || "anonymous function"}]`);
    // logger.info(`Request URL: ${req.originalUrl}`);
    // logger.info(`Request Method: ${req.method}`);

    fn(req, res, next)
      .then(() => {
        // logger.info(`[END OF ACTION: Async function ${fn.name || "anonymous function"} completed]`);
        // logger.info("======= [END OF MIDDLEWARE: wrapAsync] =======\n");
      })
      .catch((err) => {
        logger.error(`[ERROR in wrapAsync: ${err.message}${err.stack ? `, StackTrace=${err.stack}` : ""}]`);
        next(err);
      });
  };
};
