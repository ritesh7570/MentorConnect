const Group = require("../models/group");
const { groupSchema } = require("../schemas/groupSchema");
const ExpressError = require("../utils/expressError");
const logger = require("../utils/logger")('groupMiddleware'); // Specify label

// Middleware to check if the group exists
module.exports.isGroup = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    logger.info(`Checking existence of group with ID: ${groupId}`);

    logger.debug(`Request parameters: ${JSON.stringify(req.params)}`);

    const group = await Group.findById(groupId);

    if (!group) {
      logger.warn(`Group with ID: ${groupId} does not exist`);
      req.flash("error", "Group does not exist!");
      return res.redirect("/groups");
    }

    logger.debug(`Found group: ${JSON.stringify(group)}`);
    req.group = group;
    logger.info(`Group with ID: ${groupId} found`);
    next();
  } catch (err) {
    logger.error(`Error in isGroup middleware: ${err.message}`);
    next(err);
  }
};

// Middleware to check if the logged-in user is the owner of the group
module.exports.isGroupOwner = async (req, res, next) => {
  try {
    const id = req.params.groupId;
    logger.info(`Checking if user is the owner of group ID: ${id}`);

    logger.debug(`Request user ID: ${req.user._id}`);

    const group = await Group.findById(id).populate("owner");

    if (!group) {
      logger.warn(`Group with ID: ${id} not found`);
      req.flash("error", "Group not found.");
      return res.redirect(`/groups/${id}`);
    }

    logger.debug(`Group owner ID: ${group.owner._id}`);
    
    if (!group.owner.equals(req.user._id)) {
      logger.warn(`User ${req.user._id} is not the owner of group ID: ${id}`);
      req.flash("error", "You do not have permission to do that.");
      return res.redirect(`/groups/${id}`);
    }

    logger.info(`User ${req.user._id} is the owner of group ID: ${id}`);
    next();
  } catch (err) {
    logger.error(`Error in isGroupOwner middleware: ${err.message}`);
    next(err);
  }
};

// Middleware to check if the logged-in user is a member of the group
module.exports.isGroupMember = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    logger.info(`Checking membership for user ${req.user._id} in group ID: ${groupId}`);

    logger.debug(`Request user ID: ${req.user._id}`);
    logger.debug(`Request parameters: ${JSON.stringify(req.params)}`);

    const group = await Group.findById(groupId);

    if (!group) {
      logger.warn(`Group with ID: ${groupId} not found`);
      req.flash("error", "Group not found.");
      return res.redirect("/groups");
    }

    logger.debug(`Group members: ${JSON.stringify(group.members)}`);
    
    const isMember = group.members.some((member) => member.equals(req.user._id));
    
    if (!isMember) {
      logger.warn(`User ${req.user._id} is not a member of group ID: ${groupId}`);
      req.flash("error", "You need to join the group to access this.");
      return res.redirect(`/groups`);
    }

    logger.info(`User ${req.user._id} is a member of group ID: ${groupId}`);
    next();
  } catch (err) {
    logger.error(`Error in isGroupMember middleware: ${err.message}`);
    next(err);
  }
};

// Middleware to validate group schema
module.exports.validateGroup = (req, res, next) => {
  try {
    logger.info("Validating group schema...");
    logger.debug(`Request body for group validation: ${JSON.stringify(req.body.group)}`);

    const { error } = groupSchema.validate(req.body.group);

    if (error) {
      const errMsg = error.details.map((el) => el.message).join(",");
      logger.error(`Validation error: ${errMsg}`);
      throw new ExpressError(400, errMsg);
    }

    logger.info("Group schema validation passed. Proceeding to the next middleware.");
    next();
  } catch (err) {
    logger.error(`Error in validateGroup middleware: ${err.message}`);
    next(err);
  }
};
