const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    menteeUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mentorUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "deleted"],
      default: "pending",
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },
    schedule: {
      start: {
        type: Date,
        required: true,
      },
      end: {
        type: Date,
        required: true,
      },
    },
    title: {
      type: String,
      required: true,
    },
    cancelReason: {
      type: String, // Reason for cancellation, if applicable
    },
    bookingReason: {
      type: String,
      required: true,
    }, // Reason for booking, if applicable
    calendlyEventUrl: {
      type: String, // URL for the Calendly event
      required: true,
    },
    techStack: {
      type: [String], // Array to store tech stacks associated with the booking
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Create the model
const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
