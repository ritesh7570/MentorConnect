// errorHandler.js
const multer = require("multer");

module.exports = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).send(err.message); // Handle Multer-specific errors
  }
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("common/error", { message });
};