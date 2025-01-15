const mongoose = require("mongoose");
const SuccessReview = require("../models/successReview");
const Success = require("../models/success");
const User = require("../models/user");
const logger = require("../utils/logger")("successReviewSeeder"); // Import logger
const { successReviewValidate } = require("../schemas/successReviewSchema");
const successReviewData = [
  { comment: "Incredible story, really inspiring!" },
  { comment: "Great journey, I learned a lot from this." },
  { comment: "I can relate to this experience." },
  { comment: "This was an eye-opener. Thank you for sharing!" },
  { comment: "Amazing transformation and growth depicted here." },
  { comment: "Such a motivating story! Well done!" },
  { comment: "Your story is truly inspiring and encouraging." },
  { comment: "I appreciate the honesty and depth in this journey." },
  { comment: "This experience resonates with me deeply." },
  { comment: "What a powerful narrative of overcoming challenges." },
  { comment: "Thank you for the insights and motivation." },
  { comment: "A truly remarkable journey with valuable lessons." },
  { comment: "Your success story is a beacon of hope." },
  { comment: "This was a very engaging and uplifting read." },
  { comment: "Your perseverance and achievements are admirable." },
  { comment: "An inspiring tale of dedication and success." },
  {
    comment: "Your story offers great lessons for anyone striving for success.",
  },
  { comment: "Such a powerful and motivational account!" },
  { comment: "I found your journey to be incredibly inspiring." },
  { comment: "The depth of your story provides much-needed encouragement." },
  { comment: "I learned a lot from your experiences and struggles." },
  { comment: "A compelling and motivating success story." },
  { comment: "Your story is a testament to hard work and perseverance." },
  { comment: "Thank you for sharing your inspiring journey." },
  { comment: "Your experience is a great source of motivation." },
  { comment: "This success story has left a significant impact on me." },
  { comment: "A truly motivating account of overcoming obstacles." },
  { comment: "Your journey is both inspiring and educational." },
  { comment: "I was deeply moved by your story of success." },
  { comment: "A fantastic story of growth and achievement." },
  { comment: "Your experiences are highly motivational and insightful." },
  { comment: "Such a moving and inspiring success story!" },
  { comment: "I appreciate the courage and honesty in your journey." },
  { comment: "Your story provides hope and motivation for others." },
  { comment: "An inspiring tale that offers great lessons for everyone." },
  {
    comment: "I found your journey to be incredibly motivating and uplifting.",
  },
  {
    comment:
      "Your success story is a great example of resilience and dedication.",
  },
  { comment: "Thank you for sharing such an inspiring and impactful journey." },
  { comment: "This is a powerful narrative of triumph over adversity." },
  {
    comment:
      "Your journey is a shining example of success through perseverance.",
  },
  { comment: "An engaging and motivating story that resonates deeply." },
  { comment: "Your story is a beacon of hope and determination." },
  { comment: "I was truly inspired by your path to success." },
  {
    comment: "A wonderful story that offers valuable lessons and inspiration.",
  },
  { comment: "Your success story is both motivational and insightful." },
  { comment: "I found your journey to be a great source of inspiration." },
  { comment: "Thank you for sharing your remarkable success story." },
  {
    comment: "Your experience is a powerful example of overcoming challenges.",
  },
  { comment: "A compelling and motivating account of your journey." },
  {
    comment:
      "Your story is a great inspiration for those facing similar challenges.",
  },
  { comment: "An incredible journey that inspires and educates." },
  { comment: "I appreciate the depth and motivation in your story." },
  { comment: "Your success story is both impactful and encouraging." },
  { comment: "A truly uplifting and motivating account of your journey." },
  { comment: "Your experiences are a great example of hard work and success." },
  {
    comment:
      "Thank you for providing such an inspiring and motivational story.",
  },
  {
    comment: "Your journey is a fantastic example of perseverance and success.",
  },
  { comment: "A powerful and inspiring narrative of overcoming obstacles." },
  { comment: "I was deeply moved by your story of achievement and growth." },
  { comment: "Your success story is a great source of motivation for others." },
  { comment: "An engaging and inspiring tale of success and dedication." },
  { comment: "Your experiences offer valuable lessons and encouragement." },
  { comment: "A remarkable story that inspires and uplifts." },
  {
    comment: "Thank you for sharing such a motivating and insightful journey.",
  },
  { comment: "Your story is a testament to hard work and perseverance." },
  {
    comment:
      "I found your journey to be incredibly inspiring and motivational.",
  },
  { comment: "Your success story offers great lessons and encouragement." },
  { comment: "A truly moving and uplifting account of your achievements." },
  { comment: "Your experiences are both motivational and educational." },
  { comment: "An inspiring journey that provides hope and encouragement." },
  {
    comment: "Thank you for sharing such a compelling and motivational story.",
  },
  {
    comment:
      "Your success story is a fantastic example of dedication and growth.",
  },
  {
    comment: "A powerful narrative that offers great inspiration and lessons.",
  },
  { comment: "Your story is a great source of motivation and hope." },
  { comment: "I was truly inspired by your path to success and achievement." },
  { comment: "A wonderful example of perseverance and dedication." },
  {
    comment:
      "Your journey offers valuable lessons and much-needed encouragement.",
  },
  { comment: "Thank you for sharing your inspiring and impactful story." },
  {
    comment: "Your success story is a great example of overcoming challenges.",
  },
  { comment: "An engaging and motivational account of your achievements." },
  { comment: "Your story is both uplifting and inspiring." },
  {
    comment:
      "I found your journey to be incredibly motivational and enlightening.",
  },
  { comment: "A remarkable tale of success and growth through perseverance." },
  {
    comment: "Your experiences offer great lessons and motivation for others.",
  },
  { comment: "Thank you for sharing such a compelling and inspiring journey." },
  {
    comment:
      "Your success story is a powerful example of hard work and resilience.",
  },
  { comment: "A truly motivating and uplifting account of your achievements." },
  {
    comment:
      "Your journey provides hope and encouragement for those facing challenges.",
  },
  {
    comment: "I was deeply inspired by your story of success and perseverance.",
  },
  { comment: "A fantastic example of dedication and triumph over adversity." },
  { comment: "Your story is both motivational and educational." },
  { comment: "Thank you for sharing such an impactful and inspiring journey." },
  { comment: "Your experiences offer valuable insights and motivation." },
  { comment: "A compelling and uplifting account of your path to success." },
  {
    comment: "Your success story is a great source of encouragement and hope.",
  },
  { comment: "I was inspired by your journey and the lessons you've shared." },
  {
    comment:
      "A wonderful narrative of achievement and growth through determination.",
  },
  { comment: "Your story is both engaging and motivating." },
  {
    comment: "Thank you for providing such a remarkable and inspiring account.",
  },
  {
    comment:
      "Your success story offers great lessons and much-needed motivation.",
  },
  {
    comment:
      "A truly impactful and uplifting journey of perseverance and success.",
  },
  {
    comment:
      "Your experiences are a fantastic source of inspiration and encouragement.",
  },
  { comment: "An inspiring tale of hard work and achievement." },
  {
    comment: "Thank you for sharing your incredible journey and success story.",
  },
  {
    comment:
      "Your story is a great example of overcoming challenges and achieving goals.",
  },
  { comment: "A motivating and insightful account of your path to success." },
  {
    comment:
      "Your experiences provide valuable lessons and inspiration for others.",
  },
  { comment: "An uplifting and engaging story of growth and achievement." },
  {
    comment:
      "Your success story is a powerful example of dedication and perseverance.",
  },
  { comment: "I found your journey to be both motivational and educational." },
  {
    comment: "Thank you for sharing such a compelling and inspiring narrative.",
  },
  {
    comment:
      "Your story is a great source of hope and encouragement for others.",
  },
  { comment: "A truly moving account of success and determination." },
  {
    comment:
      "Your experiences are highly motivational and offer great lessons.",
  },
  { comment: "An engaging and inspiring success story that resonates deeply." },
  {
    comment: "Thank you for sharing your remarkable journey and achievements.",
  },
  {
    comment:
      "Your success story is a fantastic example of hard work and growth.",
  },
  { comment: "A powerful and motivational narrative of overcoming obstacles." },
  { comment: "I was inspired by your story of perseverance and success." },
  {
    comment:
      "Your journey provides valuable insights and encouragement for others.",
  },
  { comment: "An uplifting and motivational tale of achievement and growth." },
  {
    comment:
      "Thank you for sharing such a powerful and inspiring success story.",
  },
  {
    comment:
      "Your experiences offer great lessons and motivation for achieving goals.",
  },
  { comment: "A truly inspiring account of success and dedication." },
  { comment: "Your story is a great source of motivation and hope." },
  {
    comment:
      "I found your journey to be incredibly uplifting and enlightening.",
  },
  {
    comment:
      "A remarkable example of growth and perseverance through challenges.",
  },
  {
    comment:
      "Thank you for sharing such an engaging and motivating success story.",
  },
  { comment: "Your success story is both impactful and inspiring." },
  {
    comment:
      "A compelling and motivating narrative of your journey to success.",
  },
  {
    comment:
      "Your experiences offer valuable lessons and much-needed encouragement.",
  },
  { comment: "An inspiring tale of overcoming adversity and achieving goals." },
  {
    comment: "Your story is a fantastic example of dedication and achievement.",
  },
  { comment: "Thank you for sharing your remarkable and motivating journey." },
  {
    comment:
      "Your success story is a powerful example of perseverance and growth.",
  },
  {
    comment:
      "A truly motivating and inspiring account of your path to success.",
  },
  {
    comment:
      "Your journey provides hope and encouragement for others facing challenges.",
  },
  { comment: "I was deeply moved by your story of success and determination." },
  {
    comment: "A wonderful example of achievement and growth through hard work.",
  },
  {
    comment:
      "Your story is both engaging and motivational, offering valuable lessons.",
  },
  { comment: "Thank you for sharing such an impactful and inspiring journey." },
  {
    comment: "Your experiences offer great insights and motivation for others.",
  },
  {
    comment: "An uplifting and compelling success story that resonates deeply.",
  },
  { comment: "Your journey is a fantastic source of inspiration and hope." },
  {
    comment: "I found your story to be incredibly motivating and enlightening.",
  },
  { comment: "A remarkable and inspiring tale of perseverance and success." },
  {
    comment: "Thank you for sharing your incredible journey and achievements.",
  },
  { comment: "Your success story is both powerful and motivational." },
  {
    comment: "A truly engaging and inspiring account of overcoming challenges.",
  },
  {
    comment:
      "Your experiences provide valuable lessons and much-needed encouragement.",
  },
  { comment: "An inspiring tale of success and growth through determination." },
  {
    comment: "Your story is a great source of motivation and hope for others.",
  },
  { comment: "I was inspired by your journey and the lessons you've shared." },
  {
    comment:
      "A wonderful narrative of achievement and growth through perseverance.",
  },
  { comment: "Your story is both engaging and motivating." },
  {
    comment: "Thank you for providing such a remarkable and inspiring account.",
  },
  {
    comment:
      "Your success story offers great lessons and much-needed motivation.",
  },
  {
    comment:
      "A truly impactful and uplifting journey of perseverance and success.",
  },
  {
    comment:
      "Your experiences are a fantastic source of inspiration and encouragement.",
  },
  { comment: "An inspiring tale of hard work and achievement." },
  {
    comment: "Thank you for sharing your incredible journey and success story.",
  },
  {
    comment:
      "Your story is a great example of overcoming challenges and achieving goals.",
  },
  { comment: "A motivating and insightful account of your path to success." },
  {
    comment:
      "Your experiences provide valuable lessons and inspiration for others.",
  },
  { comment: "An uplifting and engaging story of growth and achievement." },
  {
    comment:
      "Your success story is a powerful example of dedication and perseverance.",
  },
  { comment: "I found your journey to be both motivational and educational." },
  {
    comment: "Thank you for sharing such a compelling and inspiring narrative.",
  },
  {
    comment:
      "Your story is a great source of hope and encouragement for others.",
  },
  { comment: "A truly moving account of success and determination." },
  {
    comment:
      "Your experiences are highly motivational and offer great lessons.",
  },
  { comment: "An engaging and inspiring success story that resonates deeply." },
  {
    comment: "Thank you for sharing your remarkable journey and achievements.",
  },
  {
    comment:
      "Your success story is a fantastic example of hard work and growth.",
  },
  { comment: "A powerful and motivational narrative of overcoming obstacles." },
  { comment: "I was inspired by your story of perseverance and success." },
  {
    comment:
      "Your journey provides valuable insights and encouragement for others.",
  },
  { comment: "An uplifting and motivational tale of achievement and growth." },
];

async function successReviewSeeder() {
  try {
    // Clear existing success reviews
    await SuccessReview.deleteMany({});
    logger.info("Existing success reviews cleared.");

    // Fetch all success stories and user IDs
    const successStories = await Success.find({});
    const users = await User.find({});
    const successIds = successStories.map((success) => success._id);
    const userIds = users.map((user) => user._id);

    if (successIds.length === 0 || userIds.length === 0) {
      logger.warn("No success stories or users found.");
      return;
    }

    for (const review of successReviewData) {
      // Pick a random success story ID for the review
      review.success =
        successIds[Math.floor(Math.random() * successIds.length)];
      // Pick a random user ID for the review author
      review.author = userIds[Math.floor(Math.random() * userIds.length)];

      // Create the review
      const newReview = await SuccessReview.create(review);
      logger.info(`Review added: "${review.comment}"`);

      // Update the success story's reviews array
      await Success.findByIdAndUpdate(review.success, {
        $push: { reviews: newReview._id },
      });
      logger.info(`Success story "${review.success}" updated with new review.`);
    }

    logger.info("Success reviews seeded successfully!");
  } catch (error) {
    logger.error("Error seeding success reviews:", error);
  }
}

module.exports = successReviewSeeder;
