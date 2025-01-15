const Joi = require("joi");
const logger = require("../utils/logger")("successSchema"); // Ensure the path to your logger is correct

// Define the schema
module.exports.successSchema = Joi.object({
  success: Joi.object({
    title: Joi.string().required().messages({
      "string.empty": "Title is required",
    }),
    description: Joi.string().required().messages({
      "string.empty": "Description is required",
    }),
    image: Joi.object({
      url: Joi.string().allow("", null),
      filename: Joi.string().allow("", null),
    }).optional(),
  }).required().messages({
    "object.required": "Success object is required",
  }),
});

// Logging-based validation
module.exports.validateSuccess = (data) => {
  logger.info("======= [SCHEMA: Success] =======");
  logger.info("[ACTION: Starting validation for Success schema]");
  logger.debug("Received data for validation: %o", data);

  const { error } = module.exports.successSchema.validate(data, { abortEarly: false });

  if (error) {
    const errorMessage = error.details.map(el => el.message).join(", ");
    logger.error(`[VALIDATION ERROR] ${errorMessage}`);
    throw new Error(`Validation error: ${errorMessage}`);
  }

  logger.info("[Validation passed successfully]");
  logger.info("======= [END OF ACTION: Validation for Success schema] =======\n");

  return true;
};
