const express = require("express");
const upload = require("../services/uploadService").upload; // Multer middleware
const router = express.Router();
const logger = require("../utils/logger")("eventRoutes");
const eventController = require("../controllers/eventController");
const { isLoggedIn } = require("../middlewares/authMiddleware");

router
  .route("/")
  .get((req, res, next) => {
    logger.info("======= [ROUTE: Get All Events] =======");
    next();
  }, eventController.index)
  // Route to create a new event

  .post(isLoggedIn,(req, res, next) => {
    logger.info("======= [ROUTE: start creating event] =======");
    next();
  },  upload.single("event[poster]"), eventController.create);

// Route to render the form for creating a new event
router.route("/new").get(
  isLoggedIn,
  (req, res, next) => {
    logger.info("======= [ROUTE: Render New Event Form] =======");
    next();
  },
  eventController.new
);

// Route to get, update, and delete a specific event
router
  .route("/:id")
  .get((req, res, next) => {
    logger.info("======= [ROUTE: Get Event Details] =======");
    next();
  }, eventController.show)
  .put(
    isLoggedIn,
    upload.single("event[poster]"),
    (req, res, next) => {
      logger.info("======= [ROUTE: Update Event] =======");
      next();
    },
    eventController.update
  )
  .delete(
    isLoggedIn,
    (req, res, next) => {
      logger.info("======= [ROUTE: Delete Event] =======");
      next();
    },
    eventController.delete
  );

// Route to render the edit form for a specific event
router.route("/:id/edit").get(isLoggedIn, (req, res, next) => {
  logger.info("======= [ROUTE: Render Edit Event Form] =======");
  next();
}, eventController.edit);

// Routes to like and leave an event
router.route("/:id/like").get(isLoggedIn, eventController.like);
router.route("/:id/join").get(isLoggedIn,(req,res,next)=>{console.log("join routes");next();
}, eventController.join);
router.route("/:id/leave").get(isLoggedIn, (req,res,next)=>{console.log("leave routes");next();
},eventController.leave);

module.exports = router;
