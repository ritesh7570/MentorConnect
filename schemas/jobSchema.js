const Joi = require("joi");
const logger = require('../utils/logger')('job schema'); // Ensure the path to your logger is correct

// Define the schema
module.exports.jobSchema = Joi.object({
  title: Joi.string().required().trim(),
  salary: Joi.number().required(),
  location: Joi.string().required().trim(),
  jobType: Joi.string()
    .valid("Full-time", "Part-time", "Internship")
    .required(),
  companyName: Joi.string().required().trim(),
  applyLink: Joi.string().uri().required().trim(),
});

// Logging-based validation
module.exports.validateJob = (data) => {
  logger.info("======= [SCHEMA: Job] =======");
  logger.info("[ACTION: Starting validation for Job schema]");
  logger.debug("Received data for validation: %o", data);

  const { error } = module.exports.jobSchema.validate(data, { abortEarly: false });

  if (error) {
    const errorMessage = error.details.map(el => el.message).join(", ");
    logger.error(`[VALIDATION ERROR] ${errorMessage}`);
    throw new Error(`Validation error: ${errorMessage}`);
  }

  logger.info("[Validation passed successfully]");
  logger.info("======= [END OF ACTION: Validation for Job schema] =======\n");

  return true;
};
