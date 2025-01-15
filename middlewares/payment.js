const Joi = require("joi");
const logger = require("../utils/logger")('paymentMiddleware');

module.exports.validatePayment = (req, res, next) => {
  try {
    logger.info("Validating payment details...");

    const paymentSchema = Joi.object({
      fullName: Joi.string().required(),
      email: Joi.string().email().optional(),
      donationTitle: Joi.string().allow('').optional(),
      amount: Joi.number().optional().min(0),
      paymentMethod: Joi.string()
        .valid("UPI", "Credit Card", "Debit Card")
        .optional(),
      upiId: Joi.string().allow('').optional(),
      cardNumber: Joi.string().allow('').optional(),
      expiryDate: Joi.string().allow('').optional(),
      cvv: Joi.string().allow('').optional(),
      debitCardNumber: Joi.string().allow('').optional(),
      debitExpiryDate: Joi.string().allow('').optional(),
      debitCvv: Joi.string().allow('').optional(),
      
    });

    console.log("Validating payment request body: ", req.body);

    const { error } = paymentSchema.validate(req.body);
    console.log("Validation error: ", error);

    if (error) {
      const msg = error.details.map((el) => el.message).join(", ");
      logger.error(`Validation error: ${msg}`);
      req.flash("error", msg);
      res.locals.redirectUrl = req.get('referer'); // Redirect back to the previous page
      return res.redirect(res.locals.redirectUrl);
    }

    logger.info("Payment details validation passed.");
    next();
  } catch (e) {
    logger.error(`Error in validatePayment middleware: ${e.message}`, { stack: e.stack });
    req.flash("error", "An error occurred during payment validation.");
    next(e);
  }
};
