const mongoose = require("mongoose");
const Booking = require("../models/bookingModel"); // Updated to use Booking model
const User = require("../models/user");
const Payment = require("../models/payment"); // Assuming Payment model exists
const logger = require("../utils/logger")("bookingSeeder");

const bookingData = [
  {
    schedule: {
      start: new Date("2024-12-08T09:00:00"),
      end: new Date("2024-12-08T10:00:00"),
    },
    title: "Session 1",
  },
  {
    schedule: {
      start: new Date("2024-12-08T11:00:00"),
      end: new Date("2024-12-08T12:00:00"),
    },
    title: "Session 2",
  },
  {
    schedule: {
      start: new Date("2024-12-09T10:00:00"),
      end: new Date("2024-12-09T11:30:00"),
    },
    title: "Session 3",
  },
  {
    schedule: {
      start: new Date("2024-12-09T14:00:00"),
      end: new Date("2024-12-09T15:00:00"),
    },
    title: "Session 4",
  },
  {
    schedule: {
      start: new Date("2024-12-10T08:00:00"),
      end: new Date("2024-12-10T09:30:00"),
    },
    title: "Session 5",
  },
  {
    schedule: {
      start: new Date("2024-12-11T13:00:00"),
      end: new Date("2024-12-11T14:30:00"),
    },
    title: "Session 6",
  },
  {
    schedule: {
      start: new Date("2024-12-12T09:30:00"),
      end: new Date("2024-12-12T11:00:00"),
    },
    title: "Session 7",
  },
  {
    schedule: {
      start: new Date("2024-12-13T10:00:00"),
      end: new Date("2024-12-13T11:30:00"),
    },
    title: "Session 8",
  },
  {
    schedule: {
      start: new Date("2024-12-14T15:00:00"),
      end: new Date("2024-12-14T16:30:00"),
    },
    title: "Session 9",
  },
  {
    schedule: {
      start: new Date("2024-12-14T17:00:00"),
      end: new Date("2024-12-14T18:30:00"),
    },
    title: "Session 10",
  },
];

async function bookingSeeder() {
  try {
    // Clear existing bookings
    await Booking.deleteMany({});
    logger.info("Existing bookings cleared.");

    // Fetch all users and payments
    const users = await User.find({});
    const payments = await Payment.find({});
    const userIds = users.map((user) => user._id);

    if (userIds.length < 2) {
      logger.warn("Not enough users found to create bookings.");
      return;
    }

    for (const bookingItem of bookingData) {
      // Hardcoded mentor ID
      const mentorUserId = "67569bae767e389e41c15d83";

      // Randomly select a mentee user
      let menteeUserId = userIds[Math.floor(Math.random() * userIds.length)];

      // Ensure mentee is not the hardcoded mentor
      while (menteeUserId.toString() === mentorUserId) {
        menteeUserId = userIds[Math.floor(Math.random() * userIds.length)];
      }

      // Randomly select a paymentId from existing payments or null if no payment is found
      const paymentId = payments.length > 0 ? payments[Math.floor(Math.random() * payments.length)]._id : null;

      // Randomly assign status: either "pending", "confirmed", or "cancelled"
      const statusOptions = ["pending", "confirmed", "cancelled"];
      const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];

      // Set reason to a specific string if the status is cancelled
      const reason = status === "cancelled" ? "Cancelled due to unforeseen circumstances" : null;

      // Set the booking details
      const bookingDetails = {
        mentorUserId,
        menteeUserId,
        schedule: bookingItem.schedule,
        status,
        payment: paymentId,
        reason,
        title: bookingItem.title, // Include the session title
      };

      // Create the booking
      const newBooking = await Booking.create(bookingDetails);
      console.info(
        `Booking created: Mentor ${mentorUserId}, Mentee ${menteeUserId}, Title: ${bookingDetails.title}, Schedule: ${bookingDetails.schedule.start} to ${bookingDetails.schedule.end}, Status: ${status}.`
      );
    }

    console.info("Bookings seeded successfully!");
  } catch (error) {
    console.error("Error seeding bookings:", error);
  }
}

module.exports = bookingSeeder;