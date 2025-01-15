const { log } = require("console");
const userService = require("../services/userService");
const Mentor = require("../models/mentor/mentor");
module.exports.register = async (req, res) => {
  try {
    const { username, password, email, role } = req.body;

    // Call userService for registration
    const { user } = await userService.register({
      username,
      password,
      email,
      role,
    });
    console.log("Registered user", username, email, role);

    if (role === "mentor") {
      // Create a mentor profile with registrationStatus set to 'pending' and fallbackRoutes set to '/onboarding1'
      const newMentor = new Mentor({
        user: user._id,
        fallbackRoutes: "/onboarding",
      });
      console.log("Creating new Mentor");

      await newMentor.save();
      console.log("Mentor saved");

      // Log the user in after successful mentor registration
      req.login(user, (err) => {
        if (err) throw new Error("Login failed");
        req.flash(
          "success",
          `Welcome ${user.username}! Complete your onboarding to start.`
        );
        // Redirect to the fallback route
        return res.redirect(newMentor.fallbackRoutes);
      });
    } else {
      // For mentee or admin, log the user in and redirect to their dashboard
      req.login(user, (err) => {
        if (err) throw new Error("Login failed");
        req.flash("success", `Welcome! ${user.username}`);
        res.redirect(`/${role}`);
      });
    }
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/auth/register");
  }
};

module.exports.forgetPassword = async (req, res) => {
  try {
    const { username, password } = req.body;
    // console.log(username, password);
    // console.log("password", password);

    // Call userService to reset the password
    await userService.resetPassword(username, password);

    req.flash("success", "Password has been reset successfully.");
    res.redirect("/auth/login");
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/auth/forgetPassword");
  }
};

module.exports.login = async (req, res) => {
  try {
    if (req.user && req.user.role === "mentor") {
      // Find mentor by user ID
      const mentor = await Mentor.findOne({ user: req.user._id });

      if (mentor) {
        // Check if onboarding form is submitted and registration is still pending
        if (
          !mentor.isOnboardingFormSubmited &&
          mentor.registrationStatus === "pending"
        ) {
          console.log("Render onboarding form...");
          return res.render("mentor/onboarding/onboardingForm"); // Show onboarding form if not submitted
        }
      }

      // Redirect to mentor dashboard if onboarding is completed or registration is not pending
      const redirectUrl = `/${req.user.role}`;
      req.flash("success", "Welcome back!");
      return res.redirect(redirectUrl);
    }

    // For non-mentor roles, redirect to the respective dashboard
    const redirectUrl = `/${req.user.role}`;
    req.flash("success", "Welcome back!");
    res.redirect(redirectUrl);
  } catch (error) {
    console.error("Error during login:", error);
    req.flash("error", "An error occurred during login. Please try again.");
    res.redirect("/auth/login"); // Redirect back to login page on error
  }
};


module.exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "Logged out successfully.");
    res.redirect("/");
  });
};


