const Joi = require('joi');
const logger = require('../utils/logger')('group  schema'); // Importing your custom logger

// Define the schema
module.exports.groupSchema = Joi.object({
  name: Joi.string().min(1).max(100).required().trim(),
  description: Joi.string().max(500).trim(),
  motto: Joi.string().max(100).trim(),
  website: Joi.string().uri().trim(),
  contactEmail: Joi.string().email().trim(),
});

// Logging-based validation
module.exports.validateGroup = (data) => {
  logger.info("======= [SCHEMA: Group] =======");
  logger.info("[ACTION: Starting validation for Group schema]");
  logger.debug("Received data for validation: %o", data);

  const { error } = module.exports.groupSchema.validate(data, { abortEarly: false });

  if (error) {
    const errorMessage = error.details.map(el => el.message).join(", ");
    logger.error(`[VALIDATION ERROR] ${errorMessage}`);
    throw new Error(`Validation error: ${errorMessage}`);
  }

  logger.info("[Validation passed successfully]");
  logger.info("======= [END OF ACTION: Validation for Group schema] =======\n");

  return true;
};
