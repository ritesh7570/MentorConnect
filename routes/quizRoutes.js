const express = require("express");
const router = express.Router({ mergeParams: true });
const logger = require("../utils/logger")('router'); // Specify label

const {
  viewQuizzes,
  showNewQuizForm,
  createQuiz,
  showQuiz,
  showEditQuizForm,
  updateQuiz,
  deleteQuiz,
  submitQuiz,
  showLeaderboard,
  startQuiz,
} = require("../controllers/quizController");

const { isLoggedIn } = require("../middlewares/authMiddleware");
const { isGroupOwner, isGroupMember, isGroup } = require("../middlewares/group");
const { validateQuiz, isQuizCreator } = require("../middlewares/quiz");

// Route to view all quizzes
router.get("/", isGroup, isGroupMember, (req, res, next) => {
    logger.info("======= [ROUTE: View Quizzes] =======");
    logger.info("[ACTION: Viewing Quizzes]");
    logger.info(`User ID: ${req.user._id} is viewing quizzes for group ${req.params.groupId}`);
    next();
}, viewQuizzes);

// Route to show new quiz form
router.get(
  "/new",
  isLoggedIn,
  isGroup,
  isGroupOwner,
  (req, res, next) => {
    logger.info("======= [ROUTE: Show New Quiz Form] =======");
    logger.info("[ACTION: Accessing New Quiz Form]");
    logger.info(`User ID: ${req.user._id} is requesting to create a new quiz in group ${req.params.groupId}`);
    next();
  },
  showNewQuizForm
);

// Route to create a new quiz
router.post(
  "/",
  isLoggedIn,
  isGroup,
  isGroupOwner,
  (req, res, next) => {
    logger.info("======= [ROUTE: Create Quiz] =======");
    logger.info("[ACTION: Submitting New Quiz]");
    logger.info(`User ID: ${req.user._id} is submitting a new quiz for group ${req.params.groupId}`);
    next();
  },
  validateQuiz,
  (req, res, next) => {
    logger.info("[ACTION: Validation Completed]");
    logger.info(`Quiz validation completed for group ${req.params.groupId}`);
    next();
  },
  createQuiz
);

// Route to show a specific quiz
router.get("/:id", (req, res, next) => {
    logger.info("======= [ROUTE: Show Quiz] =======");
    logger.info("[ACTION: Viewing Quiz]");
    logger.info(`User ID: ${req.user._id} is viewing quiz ${req.params.id}`);
    next();
}, showQuiz);

// Route to show edit quiz form
router.get("/:id/edit", isLoggedIn, isQuizCreator, (req, res, next) => {
    logger.info("======= [ROUTE: Show Edit Quiz Form] =======");
    logger.info("[ACTION: Accessing Edit Quiz Form]");
    logger.info(`User ID: ${req.user._id} is requesting to edit quiz ${req.params.id}`);
    next();
}, showEditQuizForm);

// Route to update a quiz
router.put("/:id", isLoggedIn, validateQuiz, isQuizCreator, (req, res, next) => {
    logger.info("======= [ROUTE: Update Quiz] =======");
    logger.info("[ACTION: Updating Quiz]");
    logger.info(`User ID: ${req.user._id} is updating quiz ${req.params.id}`);
    next();
}, updateQuiz);

// Route to delete a quiz
router.delete("/:id", isLoggedIn, isQuizCreator, (req, res, next) => {
    logger.info("======= [ROUTE: Delete Quiz] =======");
    logger.info("[ACTION: Deleting Quiz]");
    logger.info(`User ID: ${req.user._id} is deleting quiz ${req.params.id}`);
    next();
}, deleteQuiz);

// Route to submit a quiz
router.post("/:id/submit", isLoggedIn, isGroupMember, (req, res, next) => {
    logger.info("======= [ROUTE: Submit Quiz] =======");
    logger.info("[ACTION: Submitting Quiz]");
    logger.info(`User ID: ${req.user._id} is submitting quiz ${req.params.id}`);
    next();
}, submitQuiz);

// Route to show the leaderboard
router.get("/:id/leaderboard", isLoggedIn, (req, res, next) => {
    logger.info("======= [ROUTE: Show Leaderboard] =======");
    logger.info("[ACTION: Viewing Leaderboard]");
    logger.info(`User ID: ${req.user._id} is viewing leaderboard for quiz ${req.params.id}`);
    next();
}, showLeaderboard);

// Route to start a quiz
router.get("/:id/start", isLoggedIn, (req, res, next) => {
    logger.info("======= [ROUTE: Start Quiz] =======");
    logger.info("[ACTION: Starting Quiz]");
    logger.info(`User ID: ${req.user._id} is starting quiz ${req.params.id}`);
    next();
}, startQuiz);

module.exports = router;
