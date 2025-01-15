const express = require("express");
const router = express.Router();
const logger = require("../utils/logger")("router"); // Specify label

const jobController = require("../controllers/jobController");
const { isLoggedIn,isMentor } = require("../middlewares/authMiddleware");
const { isJobOwner, validateJob } = require("../middlewares/job");

// Route to get all jobs and create a new job
router
  .route("/")
  .get(
    (req, res, next) => {
      logger.info("======= [ROUTE: Get All Jobs] =======");
      logger.info("[ACTION: Fetching All Jobs]");
      next();
    },
    (req, res, next) => {
      console.log("job get router request");
      next();
    },
    jobController.index
  )
  .post(
    isLoggedIn,isMentor,
    (req, res, next) => {
      logger.info("======= [ROUTE: Create New Job] =======");
      logger.info("[ACTION: Creating New Job]");
      logger.info(`User ID: ${req.user._id} is creating a new job`);
      logger.debug(`Request body: ${JSON.stringify(req.body)}`);
      next();
    },
    validateJob,
    (req, res, next) => {
      logger.debug("Job validation passed. Proceeding to create the job.");
      next();
    },
    jobController.create
  );

// Route to render the new job form
router.route("/new").get(isLoggedIn, (req, res, next) => {
    logger.info("======= [ROUTE: Render New Job Form] =======");
    logger.info("[ACTION: Rendering New Job Form]");
    next();
}, jobController.renderNewForm);

// Route to show, update, and delete a specific job
router
  .route("/:id")
  .get((req, res, next) => {
    logger.info("======= [ROUTE: Show Job Details] =======");
    logger.info("[ACTION: Fetching Job Details]");
    logger.info(`Job ID: ${req.params.id}`);
    next();
  }, jobController.show)
  .put(
    isLoggedIn,
    isJobOwner,
    (req, res, next) => {
      logger.info("======= [ROUTE: Update Job] =======");
      logger.info("[ACTION: Updating Job]");
      logger.info(
        `User ID: ${req.user._id} is updating job ID: ${req.params.id}`
      );
      logger.debug(`Request body: ${JSON.stringify(req.body)}`);
      next();
    },
    validateJob,
    (req, res, next) => {
      logger.debug("Job validation passed. Proceeding to update the job.");
      next();
    },
    jobController.update
  )
  .delete(
    isLoggedIn,
    isJobOwner,
    (req, res, next) => {
      logger.info("======= [ROUTE: Delete Job] =======");
      logger.info("[ACTION: Deleting Job]");
      logger.info(
        `User ID: ${req.user._id} is deleting job ID: ${req.params.id}`
      );
      next();
    },
    jobController.delete
  );

// Route to render the edit form for a specific job
router.route("/:id/edit").get(
  isLoggedIn,
  isJobOwner,
  (req, res, next) => {
    logger.info("======= [ROUTE: Render Edit Job Form] =======");
    logger.info("[ACTION: Rendering Edit Form]");
    logger.info(
      `User ID: ${req.user._id} is requesting to edit job ID: ${req.params.id}`
    );
    next();
  },
  jobController.renderEditForm
);

// Route to like, comment, and report a job
router.route("/:id/like").get(
  isLoggedIn,
  (req, res, next) => {
    logger.info("======= [ROUTE: Like Job] =======");
    logger.info("[ACTION: Liking Job]");
    logger.info(`User ID: ${req.user._id} is liking job ID: ${req.params.id}`);
    next();
  },
  jobController.like
);

router.route("/:id/comment").get(isLoggedIn, (req, res, next) => {
    logger.info("======= [ROUTE: Comment on Job] =======");
    logger.info("[ACTION: Commenting on Job]");
    logger.info(
      `User ID: ${req.user._id} is commenting on job ID: ${req.params.id}`
    );
    next();
}, jobController.comment);

router.route("/:id/report").get(isLoggedIn, (req, res, next) => {
    logger.info("======= [ROUTE: Report Job] =======");
    logger.info("[ACTION: Reporting Job]");
    logger.info(
      `User ID: ${req.user._id} is reporting job ID: ${req.params.id}`
    );
    next();
}, jobController.report);

module.exports = router;
