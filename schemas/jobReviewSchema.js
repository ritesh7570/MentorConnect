const Joi = require("joi");
const logger = require('../utils/logger')('job review schema')// Ensure the path to your logger is correct

// Define the schema
module.exports.jobReviewSchema = Joi.object({
  jobReview: Joi.object({
    comment: Joi.string().required().trim(),
  }).required(),
});

// Logging-based validation
module.exports.validateJobReview = (data) => {
  logger.info("======= [SCHEMA: JobReview] =======");
  logger.info("[ACTION: Starting validation for JobReview schema]");
  logger.debug("Received data for validation: %o", data);

  const { error } = module.exports.jobReviewSchema.validate(data, { abortEarly: false });

  if (error) {
    const errorMessage = error.details.map(el => el.message).join(", ");
    logger.error(`[VALIDATION ERROR] ${errorMessage}`);
    throw new Error(`Validation error: ${errorMessage}`);
  }

  logger.info("[Validation passed successfully]");
  logger.info("======= [END OF ACTION: Validation for JobReview schema] =======\n");

  return true;
};
