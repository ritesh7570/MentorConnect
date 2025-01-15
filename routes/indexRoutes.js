// indexRoutes.js
const express = require("express");
const router = express.Router();

router.use("/auth", require("./authWebRoutes"));
router.use("/mentor", require("./mentorWebRoutes"));
router.use("/chat", require("./chatRoutes"));
router.use("/mentee", require("./menteeWebRoutes"));
router.use("/admin", require("./adminWebRoutes"));
router.use("/jobs", require("./jobRoutes"));
router.use("/jobs/:id/reviews", require("./jobReviewRoutes"));
router.use("/groups", require("./groupRoutes"));
router.use("/groups/:groupId/quizzes", require("./quizRoutes"));
router.use("/discussions", require("./discussionRoutes"));
router.use("/discussions/:id/reviews", require("./discussionReviewRoutes"));
router.use("/api/payment", require("./paymentRoutes"));
router.use("/successes", require("./successRoutes"));
router.use("/successes/:id/reviews", require("./successReviewRoutes"));
router.use("/donations", require("./donationRoutes"));
router.use("/events", require("./eventRoutes"));
router.use("/slot", require("./slotPaymentRoutes"));
router.use("/mentee/slot", require("./menteeSlotRoutes"));
router.use("/onboarding", require("./onboardingRoutes"));


module.exports = router;