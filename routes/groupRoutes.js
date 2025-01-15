const express = require("express");
const router = express.Router();
const logger = require("../utils/logger")('route'); // Import the logger
const { isLoggedIn,isMentor } = require("../middlewares/authMiddleware");
const { isGroupOwner, isGroupMember, validateGroup } = require("../middlewares/group");
const { validateQuiz } = require("../middlewares/quiz");
const {
  listGroups,
  renderNewForm,
  createGroup,
  showGroup,
  renderEditForm,
  updateGroup,
  joinGroup,
  leaveGroup,
  deleteGroup,
} = require("../controllers/groupController");

// Route to list all groups
router.get("/", isLoggedIn, (req, res, next) => {
  logger.info(`======= [ROUTE: List Groups] =======`);
  logger.info(`[ACTION: Fetching All Groups]`);
  logger.info(`User ID: ${req.user._id} is fetching the list of all groups`);
  next();
}, listGroups);

// Route to display the form for creating a new group
router.get("/new", isLoggedIn, (req, res, next) => {
  logger.info(`======= [ROUTE: New Group Form] =======`);
  logger.info(`[ACTION: Requesting New Group Form]`);
  logger.info(`User ID: ${req.user._id} is requesting the form to create a new group`);
  next();
}, renderNewForm);

// Route to create a new group
router.post("/", isLoggedIn, isMentor,(req, res, next) => {
  logger.info(`======= [ROUTE: Create Group] =======`);
  logger.info(`[ACTION: Creating New Group]`);
  logger.info(`User ID: ${req.user._id} is creating a new group`);
  next();
}, validateGroup, createGroup);

// Route to view a specific group
router.get("/:groupId", isLoggedIn,  (req, res, next) => {
  logger.info(`======= [ROUTE: View Group] =======`);
  logger.info(`[ACTION: Viewing Group Details]`);
  logger.info(`User ID: ${req.user._id} is viewing details for group ${req.params.groupId}`);
  next();
}, showGroup);

// Route to display the form for editing a group
router.get("/:groupId/edit", isLoggedIn, isGroupOwner, (req, res, next) => {
  logger.info(`======= [ROUTE: Edit Group Form] =======`);
  logger.info(`[ACTION: Requesting Edit Group Form]`);
  logger.info(`User ID: ${req.user._id} is requesting the form to edit group ${req.params.groupId}`);
  next();
}, renderEditForm);

// Route to update a specific group
router.put("/:groupId", isLoggedIn, isGroupOwner, (req, res, next) => {
  logger.info(`======= [ROUTE: Update Group] =======`);
  logger.info(`[ACTION: Updating Group]`);
  logger.info(`User ID: ${req.user._id} is updating group ${req.params.groupId}`);
  next();
}, validateGroup, updateGroup);

// Route to join a specific group
router.post("/:groupId/join", isLoggedIn, (req, res, next) => {
  logger.info(`======= [ROUTE: Join Group] =======`);
  logger.info(`[ACTION: Joining Group]`);
  logger.info(`User ID: ${req.user._id} is joining group ${req.params.groupId}`);
  next();
}, joinGroup);

// Route to leave a specific group
router.post("/:groupId/leave", isLoggedIn, (req, res, next) => {
  logger.info(`======= [ROUTE: Leave Group] =======`);
  logger.info(`[ACTION: Leaving Group]`);
  logger.info(`User ID: ${req.user._id} is leaving group ${req.params.groupId}`);
  next();
}, leaveGroup);

// Route to delete a specific group
router.delete("/:groupId", isLoggedIn, isGroupOwner, (req, res, next) => {
  logger.info(`======= [ROUTE: Delete Group] =======`);
  logger.info(`[ACTION: Attempting to Delete Group]`);
  logger.info(`User ID: ${req.user._id} is attempting to delete group ${req.params.groupId}`);
  next();
}, deleteGroup);

module.exports = router;
