const mongoose = require("mongoose");
const Event = require("./models/event");
const User = require("./models/user");
const Group = require("./models/group");
const Donation = require("./models/donation");

const seedEvents = async () => {
  try {
    // Fetch all users, groups, and donations
    const users = await User.find({});
    const groups = await Group.find({});
    const donations = await Donation.find({});

    // Create a new event (add event creation logic as per your need)
    const newEvent = new Event({
      title: "Alumni Meetup",
      description: "An event to connect with alumni.",
      organiser: users[0]._id, // First user as organiser
      date: new Date(),
      time: "18:00",
      isOnline: true,
      link: "https://example.com/meetup",
      poster: { url: "poster_url", filename: "poster_image" },
      chiefGuests: { name: "John Doe", image: { url: "chief_guest_img", filename: "guest_img" } },
      group: groups.length ? groups[0]._id : null, // Link first group
      donation: donations.length ? donations[0]._id : null, // Link first donation if available
      isDonationRequired: true,
      isGroupAssociated: !!groups.length,
    });
    const savedEvent = await newEvent.save();

    // Update organiser's `eventsOrganised` array
    await User.findByIdAndUpdate(
      users[0]._id,
      { $push: { eventsOrganised: savedEvent._id } }
    );

    // If event linked to a group, update group's events array
    if (savedEvent.group) {
      await Group.findByIdAndUpdate(
        savedEvent.group,
        { $push: { events: savedEvent._id } }
      );
    }

    // If event linked to a donation, update donation's events array
    if (savedEvent.donation) {
      await Donation.findByIdAndUpdate(
        savedEvent.donation,
        { $push: { associatedEvents: savedEvent._id } }
      );
    }

    // Randomly assign users to join, like, and report this event
    const randomUserActions = (usersArray, actionType) => {
      const randomUsers = usersArray
        .sort(() => 0.5 - Math.random()) // Shuffle users
        .slice(0, Math.floor(Math.random() * usersArray.length)); // Select random number of users

      return randomUsers.map(user => user._id);
    };

    // Assign users to join the event
    const joinedUsers = randomUserActions(users, "join");
    savedEvent.joinMembers.push(...joinedUsers);

    // Assign users to like the event
    const likedUsers = randomUserActions(users, "like");
    savedEvent.likes.push(...likedUsers);

    // Assign users to report the event
    const reportedUsers = randomUserActions(users, "report");
    savedEvent.reports.push(...reportedUsers);

    // Save updated event with joined, liked, and reported users
    await savedEvent.save();

    console.log("Seeder executed: Event and user actions populated successfully.");
  } catch (error) {
    console.error("Error seeding event:", error);
  }
};

module.exports = seedEvents;