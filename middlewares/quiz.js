const Quiz = require("../models/quiz");
const { quizSchema } = require("../schemas/quizSchema");
const ExpressError = require("../utils/expressError");
const logger = require("../utils/logger")('quizMiddleware'); // Specify label

// Middleware to validate quiz data using Joi
module.exports.validateQuiz = (req, res, next) => {
  try {
    logger.info("Validating quiz data...");

    const { error } = quizSchema.validate(req.body, { abortEarly: false });

    if (error) {
      const errorMessages = error.details.map((err) => err.message);
      logger.error(`Validation errors: ${errorMessages.join(", ")}`);
      req.flash("error", errorMessages.join(", "));
      return res.redirect("/groups");
    }

    logger.info("Quiz data validation passed.");
    next();
  } catch (e) {
    logger.error(`Error in validateQuiz middleware: ${e.message}`);
    next(e);
  }
};

// Middleware to check if the logged-in user is the creator of the quiz
module.exports.isQuizCreator = async (req, res, next) => {
  const { id } = req.params;
  try {
    logger.info(`Checking if user is creator of quiz ID: ${id}`);

    const quiz = await Quiz.findById(id).populate("createdBy");

    if (!quiz) {
      logger.warn(`Quiz with ID: ${id} not found`);
      req.flash("error", "Quiz not found");
      return res.redirect(`/groups`);
    }

    logger.info(`Quiz creator ID: ${quiz.createdBy._id}, Logged-in user ID: ${req.user._id}`);

    if (!quiz.createdBy._id.equals(req.user._id)) {
      logger.warn("User is not authorized to edit this quiz");
      req.flash("error", "You do not have permission to edit this quiz");
      return res.redirect(`/groups/${quiz.group}`);
    }

    logger.info("User is authorized to edit this quiz.");
    next();
  } catch (e) {
    logger.error(`Error in isQuizCreator middleware: ${e.message}`);
    next(e);
  }
};
