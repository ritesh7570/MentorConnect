const onboardingController = require("../controllers/onboardingController");
const Mentor = require("../models/mentor/mentor");
const express = require("express");
const router = express.Router();
const upload = require("../services/pdfUploadService").pdfUpload; // Multer middleware

// Onboarding route (for mentors, only if registrationStatus is pending)
router.get("/", async (req, res) => {
  console.log("onboarding '/' route : ");
  console.log("User: ", req.user);
  
  try {
    if (req.user && req.user.role === "mentor") {
      // Find mentor by user ID
      const mentor = await Mentor.findOne({ user: req.user._id });
      console.log("mentor found: ", mentor);

      if (!mentor) {
        req.flash("error", "Mentor profile not found.");
        return res.redirect("/auth/login");
      }

      if (!mentor.isOnboardingFormSubmited) {
        // Render the onboarding form if it hasn't been submitted yet
        return res.render("mentor/onboarding/onboardingForm");
      } else {
        // Check registrationStatus after the form is submitted
        if (mentor.registrationStatus === "pending") {
          req.flash("info", "Your onboarding is under review. Please wait for admin approval.");
          return res.redirect("/mentor");
        } else if (mentor.registrationStatus === "rejected") {
          req.flash("error", "Your onboarding has been rejected. Please contact support.");
          return res.redirect("/mentor"); // Redirect to mentor dashboard or other support page
        } else if (mentor.registrationStatus === "approved") {
          req.flash("success", "Your onboarding has been approved! Welcome aboard.");
          return res.redirect("/mentor");
        }
      }
    } else {
      return res.redirect("/auth/login"); // Ensure only logged-in mentors can access
    }
  } catch (error) {
    console.error(error);
    req.flash("error", "An error occurred. Please try again.");
    res.redirect("/auth/login");
  }
});


// Onboarding form submission (for mentors)
router.post(
  "/",
  upload.single("experienceCertificate"),
  onboardingController.onboarding
);

module.exports = router;
