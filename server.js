// Handle Unhandled Rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", { promise, reason });
  process.exit(1);
});

// Environment Configuration
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Imports
const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const http = require("http");
const path = require("path");
const socketIo = require("socket.io");

// Configs & Services
const connectToDatabase = require("./config/mongoConfig");
const flashConfig = require("./config/flashConfig");
const errorHandler = require("./middlewares/errorHandler");
const routes = require("./routes/indexRoutes");

// Models
const User = require("./models/user");
const Booking = require("./models/bookingModel");

// Initialize Express
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// MongoDB Connection
connectToDatabase();
if (process.env.NODE_ENV === "production") {
  try {
    require("./seeder/index.js");
    console.log("Seeder ran successfully.");
  } catch (err) {
    console.error("Seeder failed:", err);
  }
}
 try {
    require("./seeder/index.js");
    console.log("Seeder ran successfully.");
  } catch (err) {
    console.error("Seeder failed:", err);
  }




// View Engine
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "yourFallbackSecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);

// Flash & Passport
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(flashConfig);

// Routes
app.use(routes);

// Landing Page
app.get("/", (req, res) => {
  if (req.isAuthenticated()) return res.redirect(`/${req.user.role}`);
  res.render("common/landingPage", { cssFile: "common/landingPage.css" });
});

// Chat Enable API
app.get("/chat-enabled/:mentorId/:menteeId", async (req, res) => {
  const { mentorId, menteeId } = req.params;
  const now = new Date();
  const booking = await Booking.findOne({
    menteeUserId: menteeId,
    mentorUserId: mentorId,
    status: "confirmed",
    "schedule.start": { $lte: now },
    "schedule.end": { $gte: now },
  });
  res.json({ chatEnabled: !!booking });
});

// Calendly Redirect
app.get("/calendly", (req, res) => {
  res.redirect("https://calendly.com/rakesh18212236");
});

// 404
app.get("*", (req, res) => {
  res.status(404).send("Page Not Found");
});

// Error Handler
app.use(errorHandler);

// Real-time Chat
require("./chatServer")(io);

// Listen
const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
