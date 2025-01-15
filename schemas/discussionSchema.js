const Joi = require('joi');
const logger = require('../utils/logger')('discussionValidation'); // Import your custom logger

// Define the schema
module.exports.discussionSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  queryType: Joi.string().valid(
    "Job",
    "Internship",
    "General Query",
    "Life Update",
    "Achievement",
    "Pledge",
    "Technical Query",
    "Notes",
    "Help",
    "Other"
  ).required(),
});

// Validate function
module.exports.validateDiscussion = (data) => {
  logger.info("======= [SCHEMA: Discussion] =======");
  logger.info("[ACTION: Starting validation for Discussion schema]");
// console.log("data received: ", data);

// console.log(
//   `..........................................................validation start hone wala h`
// );
// logger.debug(`Received data for validation: ${data}`);
// console.log("hello 1");
// console.log("Validating discussion:", data);

const { error } = module.exports.discussionSchema.validate(data, { abortEarly: false });
// console.log("Validation result:", error ? error.details : "No error");
// console.log("hello 2");

if (error) {
  const errorMessage = error.details.map((el) => el.message).join(", ");
  logger.error(`[VALIDATION ERROR] ${errorMessage}`);

  console.log(
    "............................................................................validation failed"
  );
  throw new Error(`Validation error: ${errorMessage}`);
}
  console.log(
    "............................................................................validation passed"
  );

  logger.info("[Validation passed successfully]");
  logger.info("======= [END OF ACTION: Validation for Discussion schema] =======\n");

  return true;
};
