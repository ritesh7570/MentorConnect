const express = require("express");
const router = express.Router();
const logger = require("../utils/logger")("slotPaymentRouter"); // Specify label
const { isLoggedIn } = require("../middlewares/authMiddleware");
const SlotPayment = require("../models/slotPaymentModel");
const Booking = require("../models/bookingModel");
const bookingService = require("../services/bookingService");

router.post("/payment/:bookingId", isLoggedIn, async (req, res) => {
  console.info("======= [ROUTE: Render Slot Payment] =======");
  console.log("req.body: ", req.body);

  try {
    const { bookingId } = req.params; // Extract booking ID from the route params
    const { paymentMethod, upiId, cardNumber, expiryDate, cvv } = req.body; // Extract payment details from the request body
    const menteeUserId = req.user._id; // Assuming `isLoggedIn` middleware attaches user details
    const mentorUserId = req.body.mentorUserId; // Ensure this comes from the form
    let totalPrice = parseInt(req.body.totalPrice, 10);
    // Validate the booking ID
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).send("Booking not found.");
    }

    // Create a new payment entry
    const payment = new SlotPayment({
      bookingId: bookingId,
      menteeUserId: menteeUserId,
      mentorUserId: mentorUserId,
      paymentMethod: paymentMethod,
      upiId: paymentMethod === "UPI" ? upiId : undefined,
      cardDetails:
        paymentMethod === "Credit Card" || paymentMethod === "Debit Card"
          ? { cardNumber, expiryDate, cvv }
          : undefined,
      amount: totalPrice,
      paymentStatus: "Pending",
    });

    await payment.save();
    // Flash success message and redirect to booking index
    req.flash("success", `Payment successful! Transaction ID: ${payment._id}.`);
    console.log("Payment successful");
    console.log(`/mentee/schedule/${mentorUserId}`);
    let oldBooking = await bookingService.getBookingByBookingId(bookingId);
    console.log("oldBooking......", oldBooking);

    bookingService.changeStatusPendingToConfirmedAndSetPaymentIdByBookingId(
      bookingId,
      payment._id
    );
    let newBooking = await bookingService.getBookingByBookingId(bookingId);
    console.log("newBooking......", newBooking);
    // TODO: Send email notification to mentor about the new payment
    // and mentee about the booking
    // and update the booking status to "Payment Received"
    // and update the mentor's booking count
    // and update the mentee's booking count
    // and update the mentor's total earnings
    // and update the mentee's total earnings
    // and update the mentor's availability status based on their bookings
    // and update the mentee's availability status based on their bookings

    // TODO: Update booking status to "Payment Received"
    //   booking.status = "Payment Received";
    //   await booking.save();

    //   // TODO: Update mentor's booking count
    //   const mentorBookingCount = await Booking.countDocuments({ mentorUserId });
    //   booking.mentor.bookingCount = mentorBookingCount;
    //   await booking.mentor.save();

    //   // TODO: Update mentee's booking count

    res.redirect(`/mentee/schedule/${mentorUserId}`);
  } catch (error) {
    console.error("Error in processing payment:", error);
    res.status(500).send("An error occurred while processing the payment.");
  }
});

// handle cancel slot, no refund only status confirmed
router.post("/delete-slot", async (req, res) => {
  const bookingId = req.body.bookingId;
  const oldBooking = await bookingService.getBookingByBookingId(bookingId);
  if (!bookingId) {
    return res
      .status(400)
      .json({ message: "Invalid request: bookingId is required." });
  }
  console.log(".......................................");
  
console.log("Booking :", oldBooking);

  const mentorUserId = oldBooking.mentorUserId._id;
  await bookingService.deleteBookingByBookingId(bookingId);
  console.log("after cancel slot, booking is: ", mentorUserId);
  console.log(`/mentee/schedule/${mentorUserId}`);
  req.flash('success',"Booking deleted successfully");
  res.redirect(`/mentee/schedule/${mentorUserId}`);
});

module.exports = router;
