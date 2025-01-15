const Booking = require("../models/bookingModel"); // Adjust the path as needed
const Payment = require("../models/slotPaymentModel"); // Assuming you have a Payment model for tracking payments

// 1. Create a new booking
async function createBooking(
  start,
  end,
  bookingReason,
  mentorUserId,
  menteeUserId,
  title
) {
  try {
    const newBooking = new Booking({
      menteeUserId,
      mentorUserId,
      status: "pending",
      schedule: { start, end },
      title,
      bookingReason,
    });

    const savedBooking = await newBooking.save();
    return savedBooking;
  } catch (error) {
    throw new Error("Error creating booking: " + error.message);
  }
}

// 2. Get a booking by its bookingId
async function getBookingByBookingId(bookingId) {
  try {
    const booking = await Booking.findById(bookingId)
      .populate("menteeUserId mentorUserId")
      .exec();
    if (!booking) {
      throw new Error("Booking not found");
    }
    return booking;
  } catch (error) {
    throw new Error("Error fetching booking: " + error.message);
  }
}

// 3. Delete a booking by bookingId
async function deleteBookingByBookingId(bookingId) {
  try {
    const booking = await Booking.findByIdAndDelete(bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }
    return booking;
  } catch (error) {
    throw new Error("Error deleting booking: " + error.message);
  }
}

// 4. Change status from 'pending' to 'confirmed' and set the paymentId for a booking
async function changeStatusPendingToConfirmedAndSetPaymentIdByBookingId(
  bookingId,
  paymentId
) {
  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }
    console.log("old booking: ", booking);

    if (booking.status !== "pending") {
      throw new Error("Booking status must be pending to confirm");
    }

    booking.status = "confirmed";
    booking.payment = paymentId; // Link the payment to the booking

    const updatedBooking = await booking.save();
    console.log("new booking: ", updatedBooking);
    return updatedBooking;
  } catch (error) {
    throw new Error("Error confirming booking: " + error.message);
  }
}

// 5. Change status from 'confirmed' to 'cancelled' by bookingId with a cancel reason
async function changeStatusConfirmedToCancelByBookingId(
  bookingId,
  cancelReason
) {
  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }

    if (booking.status !== "confirmed") {
      throw new Error("Booking must be confirmed to cancel");
    }

    booking.status = "cancelled";
    booking.cancelReason = cancelReason;

    const updatedBooking = await booking.save();
    return updatedBooking;
  } catch (error) {
    throw new Error("Error canceling booking: " + error.message);
  }
}

// 6. Change the starting time of a booking
async function changeStartingTimeByBookingId(bookingId, newStartTime) {
  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }

    booking.schedule.start = newStartTime;

    const updatedBooking = await booking.save();
    return updatedBooking;
  } catch (error) {
    throw new Error("Error updating start time: " + error.message);
  }
}

// 7. Change the ending time of a booking
async function changeEndingTimeByBookingId(bookingId, newEndTime) {
  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }

    booking.schedule.end = newEndTime;

    const updatedBooking = await booking.save();
    return updatedBooking;
  } catch (error) {
    throw new Error("Error updating end time: " + error.message);
  }
}

// 8. Change both the starting and ending times of a booking
async function changeStartingAndEndingTimeByBookingId(
  bookingId,
  newStartTime,
  newEndTime
) {
  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }

    booking.schedule.start = newStartTime;
    booking.schedule.end = newEndTime;

    const updatedBooking = await booking.save();
    return updatedBooking;
  } catch (error) {
    throw new Error("Error updating start and end times: " + error.message);
  }
}

// 9. Change the booking reason of a booking
async function changeBookingReasonByBookingId(bookingId, newReason) {
  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }

    booking.bookingReason = newReason;

    const updatedBooking = await booking.save();
    return updatedBooking;
  } catch (error) {
    throw new Error("Error updating booking reason: " + error.message);
  }
}

// 10. Change the cancellation reason of a booking
async function changeCancelReasonByBookingId(bookingId, newReason) {
  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }

    booking.cancelReason = newReason;

    const updatedBooking = await booking.save();
    return updatedBooking;
  } catch (error) {
    throw new Error("Error updating cancel reason: " + error.message);
  }
}

async function changeStatusConfirmedToDeleteByBookingId(
    bookingId,
  ) {
    try {
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        throw new Error("Booking not found");
      }

      //   if (booking.status !== "confirmed") {
      //     throw new Error("Booking must be confirmed to cancel");
      //   }

      booking.status = "deleted";
      const updatedBooking = await booking.save();
      return updatedBooking;
    } catch (error) {
      throw new Error("Error canceling booking: " + error.message);
    }
  }
  
async function deleteBookingByBookingId(bookingId) {
  try {
    // Find the booking by ID
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }

    // Permanently delete the booking
    await Booking.findByIdAndDelete(bookingId);

    return { message: "Booking deleted successfully", bookingId };
  } catch (error) {
    throw new Error("Error deleting booking: " + error.message);
  }
}
  

module.exports = {
  createBooking,
  getBookingByBookingId,
  deleteBookingByBookingId,
  changeStatusPendingToConfirmedAndSetPaymentIdByBookingId,
  changeStatusConfirmedToCancelByBookingId,
  changeStartingTimeByBookingId,
  changeEndingTimeByBookingId,
  changeStartingAndEndingTimeByBookingId,
  changeBookingReasonByBookingId,
  changeCancelReasonByBookingId,
  changeStatusConfirmedToDeleteByBookingId,
  deleteBookingByBookingId,
};
