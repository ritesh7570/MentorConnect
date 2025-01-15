const Quiz = require("../models/quiz");
const Group = require("../models/group");
const ExpressError = require("../utils/expressError");
const wrapAsync = require("../utils/wrapAsync");
const logger = require("../utils/logger")('quizController'); // Specify label

module.exports.viewQuizzes = wrapAsync(async (req, res) => {
  const { groupId } = req.params;
  try {
    logger.info(`Fetching quizzes for group ID: ${groupId}`);

    const group = await Group.findById(groupId).populate("quizzes");
    if (!group) {
      logger.error(`Group not found for ID: ${groupId}`);
      req.flash("error", "Group not found.");
      return res.redirect("/groups");
    }

    res.render("quizzes/index", { group, cssFile: "quiz/quizIndex.css" });
    logger.info(`Rendered quizzes index page for group ID: ${groupId}`);
  } catch (error) {
    logger.error(`Error fetching quizzes for group ID: ${groupId}`, error);
    req.flash("error", "Error retrieving quizzes.");
    res.redirect("/groups");
  }
});

module.exports.showNewQuizForm = wrapAsync(async (req, res) => {
  try {
    const group = req.group; // Get the group from the isGroup middleware
    
    res.render("quizzes/new", { group, cssFile: "quiz/quizNew.css" });
    logger.info(`Rendered new quiz form for group ID: ${group._id}`);
  } catch (error) {
    logger.error(`Error rendering new quiz form for group ID: ${req.group._id}`, error);
    req.flash("error", "Error displaying new quiz form.");
    res.redirect("/groups");
  }
});

module.exports.createQuiz = wrapAsync(async (req, res) => {
  const { groupId } = req.params;
  try {
    logger.info(`Creating quiz for group ID: ${groupId}`);

    const group = await Group.findById(groupId);
    if (!group) {
      logger.error(`Group not found for ID: ${groupId}`);
      req.flash("error", "Group not found.");
      return res.redirect("/groups");
    }

    const quizData = req.body.quiz;
    const quiz = new Quiz({
      title: quizData.title,
      questions: quizData.questions.map(q => ({
        questionText: q.questionText,
        options: q.options,
        correctAnswer: q.correctAnswer - 1, // Adjust index to be 0-based
      })),
      group: group._id,
      createdBy: req.user._id,
    });

    await quiz.save();
    group.quizzes.push(quiz._id);
    await group.save();

    logger.info(`Quiz created successfully with ID: ${quiz._id}`);
    req.flash("success", "Quiz created successfully!");
    res.redirect(`/groups/${groupId}/quizzes`);
  } catch (error) {
    logger.error(`Error creating quiz for group ID: ${groupId}`, error);
    req.flash("error", "Error creating quiz.");
    res.redirect(`/groups/${groupId}/quizzes`);
  }
});

module.exports.showQuiz = wrapAsync(async (req, res) => {
  const { id, groupId } = req.params;
  try {
    logger.info(`Fetching quiz with ID: ${id}`);

    const quiz = await Quiz.findById(id)
      .populate("group")
      .populate("scores.user");
    if (!quiz) {
      logger.error(`Quiz not found with ID: ${id}`);
      throw new ExpressError("Quiz not found", 404);
    }

    res.render("quizzes/show", {
      quiz,
      groupId,
      currUser: req.user._id,
      cssFile: "quiz/quizShow.css",
    });
    logger.info(`Rendered quiz show page for quiz ID: ${id}`);
  } catch (error) {
    logger.error(`Error fetching quiz with ID: ${id}`, error);
    throw new ExpressError("Error retrieving quiz", 500);
  }
});

module.exports.showEditQuizForm = wrapAsync(async (req, res) => {
  const { id, groupId } = req.params;
  try {
    logger.info(`Fetching quiz for editing with ID: ${id}`);

    const quiz = await Quiz.findById(id);
    if (!quiz) {
      logger.error(`Quiz not found for ID: ${id}`);
      throw new ExpressError("Quiz not found", 404);
    }

    res.render("quizzes/edit", { quiz, groupId, cssFile: "quiz/quizEdit.css" });
    logger.info(`Rendered edit quiz form for quiz ID: ${id}`);
  } catch (error) {
    logger.error(`Error fetching quiz for editing with ID: ${id}`, error);
    throw new ExpressError("Error retrieving quiz for editing", 500);
  }
});

module.exports.updateQuiz = wrapAsync(async (req, res) => {
  const { id, groupId } = req.params;
  try {
    logger.info(`Updating quiz with ID: ${id}`);

    await Quiz.findByIdAndUpdate(id, { ...req.body.quiz });
    req.flash("success", "Successfully updated the quiz!");
    res.redirect(`/groups/${groupId}/quizzes`);
    logger.info(`Updated quiz with ID: ${id}`);
  } catch (error) {
    logger.error(`Error updating quiz with ID: ${id}`, error);
    req.flash("error", "Error updating quiz.");
    res.redirect(`/groups/${groupId}/quizzes`);
  }
});

module.exports.deleteQuiz = wrapAsync(async (req, res) => {
  const { id, groupId } = req.params;
  try {
    logger.info(`Deleting quiz with ID: ${id}`);

    await Quiz.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted the quiz");
    res.redirect(`/groups/${groupId}`);
    logger.info(`Deleted quiz with ID: ${id}`);
  } catch (error) {
    logger.error(`Error deleting quiz with ID: ${id}`, error);
    req.flash("error", "Error deleting quiz.");
    res.redirect(`/groups/${groupId}`);
  }
});

module.exports.submitQuiz = wrapAsync(async (req, res) => {
  const { id, groupId } = req.params;
  try {
    logger.info(`Submitting quiz with ID: ${id}`);

    const quiz = await Quiz.findById(id);
    const userAnswers = req.body.answers || {};
  
    const score = quiz.questions.reduce((acc, question, index) => {
      if (userAnswers[index] !== undefined && parseInt(userAnswers[index]) === question.correctAnswer) {
        acc += 1;
      }
      return acc;
    }, 0);

    const existingScore = quiz.scores.find(s => s.user.equals(req.user._id));
    if (existingScore) {
      existingScore.score = score;
    } else {
      quiz.scores.push({ user: req.user._id, score });
    }

    await quiz.save();
    req.flash("success", `You scored ${score}/${quiz.questions.length} correct answers!`);
    res.redirect(`/groups/${groupId}/quizzes`);
    logger.info(`Quiz submitted with score: ${score} for quiz ID: ${id}`);
  } catch (error) {
    logger.error(`Error submitting quiz with ID: ${id}`, error);
    req.flash("error", "Error submitting quiz.");
    res.redirect(`/groups/${groupId}/quizzes`);
  }
});

module.exports.showLeaderboard = wrapAsync(async (req, res) => {
  const { id, groupId } = req.params;
  try {
    logger.info(`Fetching leaderboard for quiz ID: ${id}`);

    const quiz = await Quiz.findById(id).populate("scores.user");

    const userScoreEntry = quiz.scores.find(score => score.user.equals(req.user._id));
    const userScore = userScoreEntry ? userScoreEntry.score : null;

    const leaderboard = quiz.scores
      .map(score => ({ username: score.user.username, score: score.score }))
      .sort((a, b) => b.score - a.score);

    res.render("quizzes/leaderboard", {
      quiz,
      groupId,
      leaderboard,
      userScore,
      cssFile: "quiz/quizLeaderboard.css",
    });

    logger.info(`Rendered leaderboard for quiz ID: ${id}`);
  } catch (error) {
    logger.error(`Error fetching leaderboard for quiz ID: ${id}`, error);
    req.flash("error", "Error retrieving leaderboard.");
    res.redirect(`/groups/${groupId}/quizzes`);
  }
});

module.exports.startQuiz = wrapAsync(async (req, res) => {
  const { id, groupId } = req.params;
  try {
    logger.info(`Starting quiz with ID: ${id}`);

    const quiz = await Quiz.findById(id).populate("group").populate("scores.user");
    if (!quiz) {
      logger.error(`Quiz not found with ID: ${id}`);
      throw new ExpressError("Quiz not found", 404);
    }

    res.render("quizzes/show", { quiz, groupId, cssFile: "quiz/quizShow.css" });
    logger.info(`Started quiz with ID: ${id}`);
  } catch (error) {
    logger.error(`Error starting quiz with ID: ${id}`, error);
    throw new ExpressError("Error starting quiz", 500);
  }
});
