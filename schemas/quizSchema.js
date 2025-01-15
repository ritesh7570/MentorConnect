const Joi = require("joi");
const logger = require('../utils/logger')('quiz schema'); // Ensure the path to your logger is correct

// Define the schema
module.exports.quizSchema = Joi.object({
  quiz: Joi.object({
    title: Joi.string().required().messages({
      "string.empty": "Quiz title is required",
    }),
    questions: Joi.array()
      .items(
        Joi.object({
          questionText: Joi.string().required().messages({
            "string.empty": "Question text is required",
          }),
          options: Joi.array()
            .items(Joi.string().required())
            .min(2) // Changed from length(4) to min(2) to align with your Mongoose schema
            .messages({
              "array.min": "Each question must have at least 2 options",
              "string.empty": "Option text cannot be empty",
            }),
          correctAnswer: Joi.number().integer().required().messages({
            "number.base": "Correct answer must be a number",
          }),
        })
      )
      .required()
      .messages({
        "array.required": "Quiz must contain questions",
      }),
  }).required(),
});

// Logging-based validation
module.exports.validateQuiz = (data) => {
  logger.info("======= [SCHEMA: Quiz] =======");
  logger.info("[ACTION: Starting validation for Quiz schema]");
  logger.debug("Received data for validation: %o", data);

  const { error } = module.exports.quizSchema.validate(data, { abortEarly: false });

  if (error) {
    const errorMessage = error.details.map(el => el.message).join(", ");
    logger.error(`[VALIDATION ERROR] ${errorMessage}`);
    throw new Error(`Validation error: ${errorMessage}`);
  }

  logger.info("[Validation passed successfully]");
  logger.info("======= [END OF ACTION: Validation for Quiz schema] =======\n");

  return true;
};
