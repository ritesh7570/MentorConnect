const Discussion = require("../models/discussion");
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const logger = require("../utils/logger")('discussionController');

module.exports.index = wrapAsync(async (req, res) => {
  logger.info("======= [CONTROLLER: Discussion] =======");
  logger.info("[ACTION: Index]");

  const { queryType, mentorUserId } = req.query; // Extract mentorUserId from query
  let discussions;

  try {
    const query = {};
    if (queryType) query.queryType = queryType; // Existing queryType logic
    if (mentorUserId) query.mentorUserId = mentorUserId; // New mentorUserId logic

    discussions = await Discussion.find(query);

    console.info(`Retrieved ${discussions.length} discussions.`);
    res.render("discussions/index", {
      discussions,
      cssFile: "discussion/discussionIndex.css",
    });
  } catch (err) {
    logger.error(`Error retrieving discussions: ${err}`);
    req.flash("error", "Failed to retrieve discussions.");
    res.redirect("/discussions");
  }

  logger.info("======= [END OF ACTION: Index] =======\n");
});


module.exports.new = (req, res) => {
  logger.info("======= [CONTROLLER: Discussion] =======");
  logger.info("[ACTION: New]");

  res.render("discussions/new", { cssFile: "discussion/discussionNew.css" });

  logger.info("======= [END OF ACTION: New] =======\n");
};

module.exports.create = wrapAsync(async (req, res) => {
  logger.info("======= [CONTROLLER: Discussion] =======");
  logger.info("[ACTION: Create]");
  logger.info(`Request Body: ${JSON.stringify(req.body)}`);

  try {
    const newDiscussion = new Discussion(req.body.discussion);
    newDiscussion.owner = req.user._id;
    await newDiscussion.save();

    logger.info(`New discussion created with ID: ${newDiscussion._id}`);

    // Add discussion ID to the user's discussionPosts
    if (!req.user.discussionPosts.includes(newDiscussion._id)) {
      req.user.discussionPosts.push(newDiscussion._id);
      await req.user.save();
      logger.info(`Updated user ${req.user.username}: added discussion ${newDiscussion.title}`);
    }

    req.flash("success", "New discussion created!");
    res.redirect("/discussions");
  } catch (err) {
    logger.error(`Error creating discussion: ${err}`);
    req.flash("error", "Failed to create discussion.");
    res.redirect("/discussions/new");
  }

  logger.info("======= [END OF ACTION: Create] =======\n");
});

module.exports.show = wrapAsync(async (req, res) => {
  logger.info("======= [CONTROLLER: Discussion] =======");
  logger.info("[ACTION: Show]");
  logger.info(`Discussion ID: ${req.params.id}`);

  try {
    const discussion = await Discussion.findById(req.params.id)
      .populate("owner")
      .populate({
        path: "reviews",
        populate: { path: "author" },
      });

    if (!discussion) {
      logger.error("Discussion not found!");
      req.flash("error", "Discussion does not exist!");
      return res.redirect("/discussions");
    }

    logger.info(`Discussion found: ${discussion._id}`);
    res.render("discussions/show", {
      discussion,
      cssFile: "discussion/discussionShow.css",
    });
  } catch (err) {
    logger.error(`Error retrieving discussion: ${err}`);
    req.flash("error", "Failed to retrieve discussion.");
    res.redirect("/discussions");
  }

  logger.info("======= [END OF ACTION: Show] =======\n");
});

module.exports.edit = wrapAsync(async (req, res) => {
  logger.info("======= [CONTROLLER: Discussion] =======");
  logger.info("[ACTION: Edit]");
  logger.info(`Discussion ID: ${req.params.id}`);

  try {
    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) {
      logger.error("Discussion not found!");
      req.flash("error", "Discussion does not exist!");
      return res.redirect("/discussions");
    }

    logger.info(`Discussion found for edit: ${discussion._id}`);
    res.render("discussions/edit", {
      discussion,
      cssFile: "discussion/discussionEdit.css",
    });
  } catch (err) {
    logger.error(`Error retrieving discussion for edit: ${err}`);
    req.flash("error", "Failed to retrieve discussion for editing.");
    res.redirect("/discussions");
  }

  logger.info("======= [END OF ACTION: Edit] =======\n");
});

module.exports.update = wrapAsync(async (req, res) => {
  logger.info("======= [CONTROLLER: Discussion] =======");
  logger.info("[ACTION: Update]");
  logger.info(`Discussion ID: ${req.params.id}`);

  try {
    await Discussion.findByIdAndUpdate(req.params.id, { ...req.body.discussion });
    req.flash("success", "Discussion updated!");
    logger.info(`Discussion updated: ${req.params.id}`);

    res.redirect(`/discussions/${req.params.id}`);
  } catch (err) {
    logger.error(`Error updating discussion: ${err}`);
    req.flash("error", "Failed to update discussion.");
    res.redirect(`/discussions/${req.params.id}/edit`);
  }

  logger.info("======= [END OF ACTION: Update] =======\n");
});

module.exports.delete = wrapAsync(async (req, res) => {
  logger.info("======= [CONTROLLER: Discussion] =======");
  logger.info("[ACTION: Delete]");
  logger.info(`Discussion ID: ${req.params.id}`);

  try {
    await Discussion.findByIdAndDelete(req.params.id);
    req.flash("success", "Discussion deleted!");
    logger.info(`Discussion deleted: ${req.params.id}`);

    res.redirect("/discussions");
  } catch (err) {
    logger.error(`Error deleting discussion: ${err}`);
    req.flash("error", "Failed to delete discussion.");
    res.redirect("/discussions");
  }

  logger.info("======= [END OF ACTION: Delete] =======\n");
});

// Like functionality
module.exports.like = wrapAsync(async (req, res) => {
  logger.info("======= [CONTROLLER: Discussion] =======");
  logger.info("[ACTION: Like]");
  logger.info(`Discussion ID: ${req.params.id}, User ID: ${req.user._id}`);

  try {
    const { id } = req.params;
    const userId = req.user._id;
    const discussion = await Discussion.findById(id);

    if (!discussion) {
      logger.error("Discussion not found!");
      req.flash("error", "Discussion does not exist!");
       // Store redirect URL
  res.locals.redirectUrl = req.get('referer'); // Redirect back to the previous page
  return res.redirect(res.locals.redirectUrl);
    
    }

    const hasLiked = discussion.likes.some((like) => like.equals(userId));

    if (hasLiked) {
      logger.info("User already liked this discussion. Removing like.");
      await Discussion.findByIdAndUpdate(id, { $pull: { likes: userId } });
    } else {
      logger.info("Liking the discussion.");
      await Discussion.findByIdAndUpdate(id, { $push: { likes: userId } });
    }
  // Store redirect URL
  res.locals.redirectUrl = req.get('referer'); // Redirect back to the previous page
  res.redirect(res.locals.redirectUrl);
  } catch (err) {
    logger.error(`Error processing like: ${err}`);
    req.flash("error", "Failed to process like.");
     // Store redirect URL
  res.locals.redirectUrl = req.get('referer'); // Redirect back to the previous page
  res.redirect(res.locals.redirectUrl);
  }

  logger.info("======= [END OF ACTION: Like] =======\n");
});

// Comment functionality
module.exports.comment = wrapAsync(async (req, res) => {
  logger.info("======= [CONTROLLER: Discussion] =======");
  logger.info("[ACTION: Comment]");
  logger.info(`Discussion ID: ${req.params.id}`);

  try {
    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) {
      logger.error("Discussion not found!");
      req.flash("error", "Discussion not found");
       // Store redirect URL
  res.locals.redirectUrl = req.get('referer'); // Redirect back to the previous page
 return res.redirect(res.locals.redirectUrl);
    }

    // Handle comment logic here...

    res.redirect(`/discussions/${req.params.id}#comment-section`);
  } catch (err) {
    logger.error(`Error processing comment: ${err}`);
    req.flash("error", "Failed to process comment.");
    // Store redirect URL
    res.locals.redirectUrl = req.get('referer'); // Redirect back to the previous page
    res.redirect(res.locals.redirectUrl);
  }

  logger.info("======= [END OF ACTION: Comment] =======\n");
});

// Report functionality
module.exports.report = wrapAsync(async (req, res) => {
  logger.info("======= [CONTROLLER: Discussion] =======");
  logger.info("[ACTION: Report]");
  logger.info(`Discussion ID: ${req.params.id}, User ID: ${req.user._id}`);

  try {
    const { id } = req.params;
    const userId = req.user._id;
    const discussion = await Discussion.findById(id);

    if (!discussion) {
      logger.error("Discussion not found!");
      req.flash("error", "Discussion does not exist!");
      return res.redirect("/discussions");
    }

    const hasReported = discussion.reports.some((report) => report.equals(userId));

    if (hasReported) {
      logger.info("User already reported this discussion. Removing report.");
      await Discussion.findByIdAndUpdate(id, { $pull: { reports: userId } });
    } else {
      logger.info("Reporting the discussion.");
      await Discussion.findByIdAndUpdate(id, { $push: { reports: userId } });
    }

    req.flash("success", "Discussion reported!");
     // Store redirect URL
  res.locals.redirectUrl = req.get('referer'); // Redirect back to the previous page
  res.redirect(res.locals.redirectUrl);
  } catch (err) {
    logger.error(`Error processing report: ${err}`);
    req.flash("error", "Failed to report discussion.");
  // Store redirect URL
  res.locals.redirectUrl = req.get('referer'); // Redirect back to the previous page
  res.redirect(res.locals.redirectUrl);
  }

  logger.info("======= [END OF ACTION: Report] =======\n");
});
