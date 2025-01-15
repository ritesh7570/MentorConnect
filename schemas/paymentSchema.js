const Joi = require("joi");
const logger = require('../utils/logger')('payment schema'); // Ensure the path to your logger is correct

// Define the schema
const paymentSchema = Joi.object({
  fullName: Joi.string().required(),
  email: Joi.string().email().optional(),
  donationTitle: Joi.string().allow('').optional(), // Keep for consistency
  amount: Joi.number().positive().required(), // Change to positive to match seeder
  paymentMethod: Joi.string()
    .valid("UPI", "Credit Card", "Debit Card")
    .required(),
  upiId: Joi.string().allow('').optional(),
  cardNumber: Joi.string().allow('').optional(),
  expiryDate: Joi.string().allow('').optional(),
  cvv: Joi.string().allow('').optional(),
  debitCardNumber: Joi.string().allow('').optional(),
  debitExpiryDate: Joi.string().allow('').optional(),
  debitCvv: Joi.string().allow('').optional(),
});

// Logging-based validation
module.exports.validatePayment = (data) => {
  logger.info("======= [SCHEMA: Payment] =======");
  logger.info("[ACTION: Starting validation for Payment schema]");
  logger.debug("Received data for validation: %o", data);

  const { error } = paymentSchema.validate(data, { abortEarly: false });

  if (error) {
    const errorMessage = error.details.map(el => el.message).join(", ");
    logger.error(`[VALIDATION ERROR] ${errorMessage}`);
    throw new Error(`Validation error: ${errorMessage}`);
  }

  logger.info("[Validation passed successfully]");
  logger.info("======= [END OF ACTION: Validation for Payment schema] =======\n");

  return true;
};

module.exports.paymentSchema = paymentSchema; // Export schema for other uses
