const Joi = require("joi");
const logger = require('../utils/logger')('success review schema'); // Ensure the path to your logger is correct

// Define the schema
module.exports.successReviewSchema = Joi.object({
  successReview: Joi.object({
    comment: Joi.string().required().messages({
      "string.empty": "Comment is required",
    }),
  }).required().messages({
    "object.required": "Success review object is required",
  }),
});

// Logging-based validation
module.exports.validateSuccessReview = (data) => {
  logger.info("======= [SCHEMA: Success Review] =======");
  logger.info("[ACTION: Starting validation for Success Review schema]");
  logger.debug("Received data for validation: %o", data);

  const { error } = module.exports.successReviewSchema.validate(data, { abortEarly: false });

  if (error) {
    const errorMessage = error.details.map(el => el.message).join(", ");
    logger.error(`[VALIDATION ERROR] ${errorMessage}`);
    throw new Error(`Validation error: ${errorMessage}`);
  }

  logger.info("[Validation passed successfully]");
  logger.info("======= [END OF ACTION: Validation for Success Review schema] =======\n");

  return true;
};
