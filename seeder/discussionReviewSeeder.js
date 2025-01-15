const mongoose = require("mongoose");
const DiscussionReview = require("../models/discussionReview");
const Discussion = require("../models/discussion");
const User = require("../models/user");
const {
  validateDiscussionReview,
} = require("../schemas/discussionReviewSchema"); // Import validation function
const logger = require("../utils/logger")("discussionReviewSeeder"); // Import the logger

const discussionReviewData = [
  {
    comment: "Great discussion! Thanks for sharing.",
  },
  {
    comment: "I had a similar issue, here's how I solved it...",
  },
  {
    comment: "This is a very informative post, thanks!",
  },
  {
    comment: "I appreciate the advice, really helpful!",
  },
  {
    comment: "Congrats on your achievement! Keep going!",
  },
  {
    comment: "I completely agree with your points.",
  },
  {
    comment: "This topic has been on my mind for a while, great insights.",
  },
  {
    comment: "Your solution worked perfectly, thanks a ton!",
  },
  {
    comment: "I think there's another way to approach this problem...",
  },
  {
    comment: "Thanks for the explanation, that cleared things up for me.",
  },
  {
    comment: "This really helped me understand the concept better.",
  },
  {
    comment: "I'm glad I found this discussion, so relevant!",
  },
  {
    comment: "This is such a well-thought-out response, thank you!",
  },
  {
    comment: "I'll definitely try this approach next time.",
  },
  {
    comment: "This thread has been very helpful, thanks everyone!",
  },
  {
    comment: "Has anyone tried this with a different tool?",
  },
  {
    comment: "This is exactly what I was looking for!",
  },
  {
    comment: "Interesting viewpoint, I hadn't considered that.",
  },
  {
    comment: "Thanks for providing the example, really useful.",
  },
  {
    comment: "This post saved me hours of work, thanks!",
  },
  {
    comment: "I have a slightly different take on this...",
  },
  {
    comment: "Great to see such an active community here!",
  },
  {
    comment: "I would love to see more discussions like this.",
  },
  {
    comment: "This really resonates with my experience, thanks!",
  },
  {
    comment: "I'm going to bookmark this for future reference.",
  },
  {
    comment: "This solved my problem instantly, thanks so much!",
  },
  {
    comment: "I didn't know that, really helpful info!",
  },
  {
    comment: "This discussion helped me figure out what I was doing wrong.",
  },
  {
    comment: "Has anyone tried this with a larger dataset?",
  },
  {
    comment: "Amazing insights, thanks for breaking it down.",
  },
  {
    comment: "I appreciate how you explained the logic behind this.",
  },
  {
    comment: "Thanks for all the contributions, this is super helpful!",
  },
  {
    comment: "I tried this method and it worked like a charm!",
  },
  {
    comment: "Could you clarify one part of your explanation?",
  },
  {
    comment: "This approach is new to me, thanks for sharing.",
  },
  {
    comment: "Such a valuable discussion, thank you!",
  },
  {
    comment: "I learned something new from this thread, thanks!",
  },
  {
    comment: "Good discussion, let's keep this going!",
  },
  {
    comment: "I appreciate the real-world example, that makes it clear.",
  },
  {
    comment: "Thanks for sharing, this helped me a lot.",
  },
  {
    comment: "I love how thorough your response is, very helpful.",
  },
  {
    comment: "This approach really opened my eyes to a different solution.",
  },
  {
    comment: "I can’t thank you enough for this clear explanation.",
  },
  {
    comment: "This discussion answered all the questions I had, thanks!",
  },
  {
    comment: "I’ll definitely be using this method from now on.",
  },
  {
    comment: "This is exactly what I was struggling with, thanks for posting!",
  },
  {
    comment: "Thanks for taking the time to share your knowledge!",
  },
  {
    comment: "Such a positive and helpful community, love it here.",
  },
  {
    comment: "I've had a similar experience, this is great advice!",
  },
  {
    comment: "This tip has saved me so much time, much appreciated!",
  },
  {
    comment: "Your solution is brilliant, I would have never thought of that.",
  },
  {
    comment: "This is a game changer for me, thanks a lot!",
  },
  {
    comment: "I just implemented this, and it's working perfectly!",
  },
  {
    comment: "Awesome contribution, this is very helpful!",
  },
];
async function discussionReviewSeeder() {
  try {
    // Clear existing discussion reviews
    await DiscussionReview.deleteMany({});
    logger.info("Existing discussion reviews cleared.");

    // Fetch all discussions and users
    const discussions = await Discussion.find({});
    const users = await User.find({});
    const userIds = users.map(user => user._id); // Extract user IDs
    const discussionIds = discussions.map(discussion => discussion._id); // Extract discussion IDs
    logger.info(
      `Found ${discussions.length} discussions and ${users.length} users.`
    );

    if (!discussionIds.length || !userIds.length) {
      throw new Error("No discussions or users found to associate with reviews.");
    }

    for (const review of discussionReviewData) {
      // Validate the review data
      try {
        validateDiscussionReview(review);
      } catch (validationError) {
        logger.error(
          `Validation failed for review: ${JSON.stringify(review)} - Error: ${validationError.message}`
        );
        continue; // Skip this review and move to the next one
      }

      // Assign a random user (author) and a random discussion to each review
      review.author = userIds[Math.floor(Math.random() * userIds.length)];
      review.discussionId = discussionIds[Math.floor(Math.random() * discussionIds.length)];

      // Create the review
      try {
        const newReview = await DiscussionReview.create(review);
        logger.info(`Review "${review.comment}" added.`);

        // Update the discussion's reviews array
        await Discussion.findByIdAndUpdate(review.discussionId, {
          $push: { reviews: newReview._id },
        });
        logger.info(
          `Discussion "${review.discussionId}" updated with new review.`
        );
      } catch (error) {
        logger.error(`Error saving/updating review: ${error.message}`);
      }
    }

    logger.info("Discussion review data seeded successfully!");
  } catch (error) {
    logger.error(`Error seeding discussion review data: ${error.message}`);
  }
}

module.exports = discussionReviewSeeder;