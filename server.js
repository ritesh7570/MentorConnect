// Handle Unhandled Rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", { promise, reason });
  process.exit(1);
});

// Environment Configuration
if (process.env.NODE_ENV !== 'production') {
  require("dotenv").config();
}

// Imports
const express = require("express");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const http = require("http");
const socketIo = require("socket.io");
const session = require("express-session");

// Configurations and Services
const connectToDatabase = require("./config/mongoConfig");
// const sessionConfig = require("./config/sessionConfig");
// const uploadService = require("./services/uploadService");
const flashConfig = require("./config/flashConfig");
const errorHandler = require("./middlewares/errorHandler");
const routes = require("./routes/indexRoutes");

// MongoDB Connection
connectToDatabase();
// Run seeder in Railway or production
if (
  process.env.RAILWAY_ENVIRONMENT || // Railway sets this env variable
  process.env.NODE_ENV === "production"
) {
  try {
    require("./seeder/index.js");
    console.log("Seeder ran successfully.");
  } catch (err) {
    console.error("Seeder failed:", err);
  }
}


// Models
const User = require("./models/user");

// Express App Initialization
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Express Configuration
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.json());
console.log("SESSION_SECRET:", process.env.SESSION_SECRET);

app.use(
  session({
    secret: process.env.SESSION_SECRET || "yourFallbackSecret",
    resave: false,
    saveUninitialized: false,
    // For production, use a store like connect-redis here
  })
);
app.use(flash());

// Passport Configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware for Flash Messages
app.use(flashConfig);

// Routes
app.use(routes);

// Landing Page Route
app.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect(`/${req.user.role}`);
  }
  res.render("common/landingPage", { cssFile: "common/landingPage.css" });
});

// Route to check if the chat is enabled
const Booking = require('./models/bookingModel');

app.get('/chat-enabled/:mentorId/:menteeId', async (req, res) => {
  const { mentorId, menteeId } = req.params;

  const now = new Date();
  const booking = await Booking.findOne({
    menteeUserId: menteeId,
    mentorUserId: mentorId,
    status: "confirmed",
    "schedule.start": { $lte: now },
    "schedule.end": { $gte: now },
  });

  res.json({ chatEnabled: !!booking }); // Return true if a valid booking is found
});

app.get("/calendly", (req, res) => {
  res.redirect("https://calendly.com/rakesh18212236");
});

app.get("*", (req, res) => {
  res.status(404).send("Page Not Found");
});

// Error Handling Middleware
app.use(errorHandler);

// Real-Time Chat Integration
const chatServer = require("./chatServer");
const { log } = require("console");
chatServer(io);

// Server Listener
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
