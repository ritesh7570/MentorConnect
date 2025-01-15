const express = require("express");
const passport = require("passport");
const { register, login, logout,forgetPassword } = require("../controllers/authWebController");
const router = express.Router();

router.get("/register", (req, res) =>
  res.render("common/register", { cssFile: "common/register.css" })
);

// Registration Route
router.post("/register", register);

router.get("/login", (req, res) => res.render("common/login"));

// Login Route
router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/",
  }),
  login
);

// Logout Route
router.get("/logout", logout);
router.post("/forgetPassword", (req, res, next) => {
  console.log("fksdfkl");
  next();
}, forgetPassword);

module.exports = router;
