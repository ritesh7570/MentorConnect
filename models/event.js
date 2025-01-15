const mongoose = require("mongoose");
const { Schema } = mongoose;
const User = require("./user"); // Import User model
const Donation = require("./donation"); // Import Donation model
const Group = require("./group"); // Import Group model if you have one
const Notification = require("./notification"); // Import Notification model
const EventReview = require("./eventReview"); // Import EventReview model

const eventSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: [1, "Title must be at least 1 character long"],
  },
  description: {
    type: String,
    trim: true,
    default: "No description provided",
  },
  organiser: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    default: "00:00",
  },
  isOnline: {
    type: Boolean,
    default: false,
  },
  link: {
    type: String,
    default: "",
    required: function () { return this.isOnline; }, // Required if the event is online
  },
  venue: {
    type: String,
    default: "",
    required: function () { return !this.isOnline; }, // Required if the event is offline
  },
  poster: {
    url: String,
    publicId: String,
  },
  joinMembers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "EventReview",
    },
  ],
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  reports: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],

}, { timestamps: true });

// Middleware to handle notifications when an event is created
// eventSchema.post("save", async function (event) {
//   try {
//     // Notify the organiser when the event is created
//     await Notification.create({
//       user: event.organiser,
//       message: `Your event "${event.title}" has been created successfully!`,
//       link: `/events/${event._id}`,
//     });

//     // Notify users who join the event
//     for (const userId of event.joinMembers) {
//       await Notification.create({
//         user: userId,
//         message: `Thank you for joining the event "${event.title}".`,
//         link: `/events/${event._id}`,
//       });
//     }

//     // Update the organiser's record
//     await User.findByIdAndUpdate(event.organiser, {
//       $push: { events: event._id }, // Assuming `events` is an array field in the User model
//     });

//     // Update join members' records
//     await User.updateMany(
//       { _id: { $in: event.joinMembers } },
//       { $push: { joinedEvents: event._id } } // Assuming `joinedEvents` is an array field in the User model
//     );

//     // Update the donation record if there's a donation associated
//     if (event.donation) {
//       await Donation.findByIdAndUpdate(event.donation, {
//         $push: { events: event._id }, // Assuming `events` is an array field in the Donation model
//       });
//     }

//     // Update the group's record if there's a group associated
//     if (event.group) {
//       await Group.findByIdAndUpdate(event.group, {
//         $push: { events: event._id }, // Assuming `events` is an array field in the Group model
//       });
//     }
//   } catch (err) {
//     console.error("Error handling event creation:", err);
//   }
// });

// // Middleware to handle notifications and data updates when an event is deleted
// eventSchema.post("findOneAndDelete", async function (event) {
//   try {
//     // Remove the event from the organiser's record
//     await User.findByIdAndUpdate(event.organiser, {
//       $pull: { events: event._id },
//     });

//     // Remove the event from join members' records
//     await User.updateMany(
//       { _id: { $in: event.joinMembers } },
//       { $pull: { joinedEvents: event._id } }
//     );

//     // Remove the event from the donation record if applicable
//     if (event.donation) {
//       await Donation.findByIdAndUpdate(event.donation, {
//         $pull: { events: event._id },
//       });
//     }

//     // Remove the event from the group's record if applicable
//     if (event.group) {
//       await Group.findByIdAndUpdate(event.group, {
//         $pull: { events: event._id },
//       });
//     }
//   } catch (err) {
//     console.error("Error handling event deletion:", err);
//   }
// });

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
