const Group = require("../models/group");
const Quiz = require("../models/quiz");
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const logger = require("../utils/logger")('groupController'); // Specify label

module.exports.listGroups = wrapAsync(async (req, res) => {
  logger.info("Fetching all groups...");
  try {
    const groups = await Group.find({}).populate("owner");
    const currUserT = req.user._id;
    const allUsers = await User.find({}).sort({ point: -1 });

    allUsers.forEach((user, index) => {
      user.isStarAlumni = index < 2; // Mark only the top 2 users as Star Alumni
    });

    logger.info(`Found ${groups.length} groups.`);
    res.render("groups/index", {
      groups,
      currUserT,
      allUsers,
      cssFile: "/group/groupIndex.css",
    });
  } catch (err) {
    logger.error(`Error fetching groups: ${err}`);
    req.flash("error", "Unable to retrieve groups at the moment.");
    res.redirect("/");
  }
});

module.exports.renderNewForm = (req, res) => {
  logger.info("Rendering new group form.");

  res.render("groups/new", { cssFile: "group/groupNew.css" });
};

module.exports.createGroup = wrapAsync(async (req, res) => {
  logger.info("Creating new group...");
  try {
    const group = new Group(req.body.group);
    group.owner = req.user._id;
    group.members.push(req.user._id);
    await group.save();
    logger.info(`New group created with ID: ${group._id}`);
    res.redirect(`/groups`);
  } catch (err) {
    logger.error(`Error creating group: ${err}`);
    req.flash("error", "Failed to create group.");
    res.redirect("/groups");
  }
});

module.exports.showGroup = wrapAsync(async (req, res) => {
  const groupId = req.params.groupId;
  logger.info(`Fetching group with ID: ${groupId}`);
  try {
    const group = await Group.findById(groupId).populate("members");
    if (!group) {
      logger.info("Group not found.");
      req.flash("error", "Group does not exist!");
      return res.redirect("/groups");
    }
    const userRole = req.user?.role || "mentee"; // Default to "mentee" if role isn't defined

    logger.info(`Group found: ${group._id}`);
    res.render("groups/show", { userRole,group, cssFile: "group/groupShow.css" });
  } catch (err) {
    logger.error(`Error fetching group: ${err}`);
    req.flash("error", "Unable to retrieve group.");
    res.redirect("/groups");
  }
});

module.exports.renderEditForm = wrapAsync(async (req, res) => {
  const groupId = req.params.groupId;
  logger.info(`Fetching group for editing with ID: ${groupId}`);
  try {
    const group = await Group.findById(groupId);
    if (!group) {
      logger.info("Group not found.");
      req.flash("error", "Group not found");
      return res.redirect("/groups");
    }
    const userRole = req.user?.role || "mentee"; // Default to "mentee" if role isn't defined

    logger.info(`Group found for editing: ${group._id}`);
    res.render("groups/edit", { group,userRole, cssFile: "group/groupEdit.css" });
  } catch (err) {
    logger.error(`Error fetching group for editing: ${err}`);
    req.flash("error", "Failed to load group for editing.");
    res.redirect("/groups");
  }
});

module.exports.updateGroup = wrapAsync(async (req, res) => {
  const { groupId } = req.params;
  logger.info(`Updating group with ID: ${groupId}`);
  logger.info(`Request Body: ${JSON.stringify(req.body)}`);
  try {
    const group = await Group.findByIdAndUpdate(groupId, { ...req.body.group });
    logger.info(`Group updated successfully: ${group._id}`);
    res.redirect(`/groups/${group._id}`);
  } catch (err) {
    logger.error(`Error updating group: ${err}`);
    req.flash("error", "Failed to update group.");
    res.redirect("/groups");
  }
});

module.exports.joinGroup = wrapAsync(async (req, res) => {
  const groupId = req.params.groupId;
  logger.info(`User ${req.user._id} attempting to join group with ID: ${groupId}`);
  try {
    const group = await Group.findById(groupId);
    if (!group) {
      logger.info("Group not found.");
      req.flash("error", "Group not found");
      return res.redirect("/groups");
    }

    const memberExists = group.members.some((member) => member.equals(req.user._id));
    if (memberExists) {
      logger.info("User is already a member of this group.");
      req.flash("error", "You are already a member of this group");
      return res.redirect(`/groups/${group._id}`);
    }

    group.members.push(req.user._id);
    group.memberCount += 1;
    await group.save();

    logger.info(`User joined the group: ${group._id}`);
    req.flash("success", "You have joined the group");
    res.redirect(`/groups/${group._id}`);
  } catch (err) {
    logger.error(`Error joining group: ${err}`);
    req.flash("error", "Failed to join group.");
    res.redirect(`/groups/${group._id}`);
  }
});

module.exports.leaveGroup = wrapAsync(async (req, res) => {
  const groupId = req.params.groupId;
  logger.info(`User ${req.user._id} attempting to leave group with ID: ${groupId}`);
  try {
    const group = await Group.findById(groupId);
    if (!group) {
      logger.info("Group not found.");
      req.flash("error", "Group not found");
      return res.redirect("/groups");
    }

    const memberIndex = group.members.findIndex((member) => member.equals(req.user._id));
    if (memberIndex === -1) {
      logger.info("User is not a member of this group.");
      req.flash("error", "You are not a member of this group");
      return res.redirect(`/groups/${group._id}`);
    }

    group.members.splice(memberIndex, 1);
    group.memberCount -= 1;
    await group.save();

    logger.info(`User left the group: ${group._id}`);
    req.flash("success", "You have left the group");
    res.redirect(`/groups/${group._id}`);
  } catch (err) {
    logger.error(`Error leaving group: ${err}`);
    req.flash("error", "Failed to leave group.");
    res.redirect(`/groups/${group._id}`);
  }
});

module.exports.deleteGroup = wrapAsync(async (req, res) => {
  const { groupId } = req.params;
  logger.info(`Deleting group with ID: ${groupId}`);
  try {
    await Group.findByIdAndDelete(groupId);
    logger.info(`Group deleted successfully: ${groupId}`);
    res.redirect("/groups");
  } catch (err) {
    logger.error(`Error deleting group: ${err}`);
    req.flash("error", "Failed to delete group.");
    res.redirect("/groups");
  }
});

// Uncomment and add these methods if you want to use quiz functionalities
// module.exports.addQuiz = wrapAsync(async (req, res) => {
//   const { groupId } = req.params;
//   const group = await Group.findById(groupId);
//   const quiz = new Quiz(req.body.quiz);
//   quiz.group = group._id;
//   quiz.createdBy = req.user._id;
//   await quiz.save();
//   group.quizzes.push(quiz);
//   await group.save();
//   logger.info(`Quiz added to group with ID: ${groupId}`);
//   res.redirect(`/groups/${groupId}`);
// });

// module.exports.showQuiz = wrapAsync(async (req, res) => {
//   const { groupId, quizId } = req.params;
//   const quiz = await Quiz.findById(quizId).populate("group");
//   if (!quiz) {
//     logger.info("Quiz not found.");
//     req.flash("error", "Quiz not found");
//     return res.redirect(`/groups/${groupId}`);
//   }
//   logger.info(`Quiz found: ${quiz._id}`);
//   res.render("quizzes/show", { quiz });
// });

// module.exports.submitQuiz = wrapAsync(async (req, res) => {
//   const { quizId } = req.params;
//   const quiz = await Quiz.findById(quizId);
//   const score = calculateScore(req.body.answers, quiz);
//   quiz.scores.push({ user: req.user._id, score });
//   await quiz.save();
//   logger.info(`Quiz submitted by user ${req.user._id}. Score: ${score}`);
//   res.redirect(`/groups/${quiz.group}`);
// });

// function calculateScore(userAnswers, quiz) {
//   let score = 0;
//   quiz.questions.forEach((question, index) => {
//     if (question.correctAnswer === userAnswers[index]) {
//       score++;
//     }
//   });
//   return score;
// }
