const express = require("express");
const router = express.Router();
const logger = require("../utils/logger")('paymentRouter'); // Specify label

const { isLoggedIn } = require("../middlewares/authMiddleware");
const { validatePayment } = require("../middlewares/payment"); // Import validatePayment middleware
const PaymentController = require("../controllers/paymentController");

// Route to render payment form
router.get("/:donationId", isLoggedIn, (req, res, next) => {
    logger.info("======= [ROUTE: Render Payment Form] =======");
    logger.info(`[ACTION: Accessing Payment Form for Donation ID: ${req.params.donationId}]`);
    logger.info(`User ID: ${req.user._id} is accessing the payment form.`);
    next();
}, PaymentController.renderPaymentForm);

// Route to handle payment submission
router.post(
  "/:donationId",
  isLoggedIn,
  validatePayment, // Add validation middleware here
  (req, res, next) => {
    logger.info("======= [ROUTE: Handle Payment Submission] =======");
    logger.info(`[ACTION: Submitting Payment for Donation ID: ${req.params.donationId}]`);
    logger.info(`User ID: ${req.user._id} is submitting payment.`);
    next();
  },
  PaymentController.processPayment
);

module.exports = router;
