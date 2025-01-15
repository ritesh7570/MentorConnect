const mongoose = require("mongoose");
const Payment = require("../models/payment");
const Donation = require("../models/donation");
const User = require("../models/user");
const logger = require("../utils/logger")("paymentSeeder");
const { validatePayment } = require("../schemas/paymentSchema");
const Notification = require("../models/notification");

const paymentData = [
  {
    fullName: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    amount: 100,
    paymentMethod: "Credit Card",
    cardNumber: "1234",
    expiryDate: "12/25",
    cvv: "123"
  },
  {
    fullName: "Vivaan Patel",
    email: "vivaan.patel@example.com",
    amount: 250,
    paymentMethod: "UPI",
    upiId: "vivaan.patel@upi",
  },
  {
    fullName: "Rajkummar Rao",
    email: "rajkummar.rao@example.com",
    amount: 6530,
    paymentMethod: "Debit Card",
    debitCardNumber: "8888",
    debitExpiryDate: "06/25",
    debitCvv: "456"
  },
];

async function paymentSeeder() {
  try {
    // Clear existing payments
    await Payment.deleteMany({});
    logger.info("Existing payments cleared.");

    // Fetch all donations and users
    const donations = await Donation.find({});
    const users = await User.find({});
    const userIds = users.map(user => user._id);
    const donationIds = donations.map(donation => donation._id);

    for (const payment of paymentData) {
      // Validate payment data
      try {
        validatePayment(payment);
      } catch (validationError) {
        console.error("Validation error: ", validationError);
        continue; // Skip to next payment if validation fails
      }

      // Randomly pick donation and donor
      const randomDonationId = donationIds[Math.floor(Math.random() * donationIds.length)];
      const donorId = userIds[Math.floor(Math.random() * userIds.length)];

      // Create the payment
      const newPayment = new Payment({
        fullName: payment.fullName,
        email: payment.email,
        amount: payment.amount,
        paymentMethod: payment.paymentMethod,
        donationId: randomDonationId,
        donor: donorId,
        // Using the new fields based on the form
        upiId: payment.upiId || undefined,
        cardNumber: payment.cardNumber || undefined,
        expiryDate: payment.expiryDate || undefined,
        cvv: payment.cvv || undefined,
        debitCardNumber: payment.debitCardNumber || undefined,
        debitExpiryDate: payment.debitExpiryDate || undefined,
        debitCvv: payment.debitCvv || undefined,
      });

      await newPayment.save();
      logger.info(`Payment for donation "${randomDonationId}" added with ID: ${newPayment._id}`);

      // Update the associated donation
      await Donation.findByIdAndUpdate(randomDonationId, {
        $push: { payments: newPayment._id },
        $inc: { totalCollection: payment.amount }, // Increment total collection by payment amount
      });

      // Update the user with payment reference
      await User.findByIdAndUpdate(donorId, {
        $push: { payments: newPayment._id },
        $inc: { points: 10 },
      });

      // Create notifications for the donor
      await Notification.create({
        user: donorId,
        message: `Thank you for your donation of ${payment.amount} to donation ID: "${randomDonationId}".`,
        link: `/donations/${randomDonationId}`,
      });

      // Create notifications for the donation owner
      const donationOwner = donations.find(donation => donation._id.equals(randomDonationId)).owner;
      await Notification.create({
        user: donationOwner._id,
        message: `A donation of ${payment.amount} was made to your donation with ID: "${randomDonationId}".`,
        link: `/donations/${randomDonationId}`,
      });

      logger.info(`Notifications created for donation ID: ${randomDonationId}`);
    }

    logger.info("Payment data seeded successfully!");
  } catch (error) {
    logger.error("Error seeding payment data:", error);
  }
}

module.exports = paymentSeeder;
