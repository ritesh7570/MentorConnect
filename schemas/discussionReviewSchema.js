const Joi = require('joi');
const logger = require('../utils/logger')('discussionReview Schema'); // Import logger

// Define the schema
module.exports.discussionReviewSchema = Joi.object({
  comment: Joi.string().required(),
});

// Logging schema validation
module.exports.validateDiscussionReview = (data) => {
  // console.log("review schema file start");
  
  logger.info("======= [SCHEMA: Discussion Review] =======");
  logger.info("[ACTION: Starting validation for Discussion Review schema]");
  // logger.debug("Received data for validation: %o", data);
  // console.log("review data: %o", data);
  

  const { error } = module.exports.discussionReviewSchema.validate(data);
  
  if (error) {
    const errorMessage = error.details.map(el => el.message).join(", ");
    logger.error(`[VALIDATION ERROR] ${errorMessage}`);
    throw new Error(`Validation error: ${errorMessage}`);
  }

  logger.info("[Validation passed successfully]");
  logger.info("======= [END OF ACTION: Validation for Discussion Review schema] =======\n");
  
  return true;
};
