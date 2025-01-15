const Mentor = require("../models/mentor/mentor");
const User = require("../models/user");
const logger = require("../utils/logger")('onboardingController'); // Specify label




// Controller for onboarding form submission
module.exports.onboarding = async (req, res) => {
    try {
      const { expertise, yearsOfExperience, calendlyLink } = req.body;
      const { file } = req;
  
      // Find the mentor by userId (assuming user is logged in)
      const mentor = await Mentor.findOne({ user: req.user._id });
  
      if (!mentor) {
        return res.status(400).json({ success: false, message: 'Mentor not found' });
      }
  
      // Check if mentor's registrationStatus is still pending
      if (mentor.registrationStatus !== 'pending') {
        return res.redirect('/mentor'); // Mentor has been approved or rejected already
      }
  
      // Update mentor details
      mentor.expertise = expertise.split(','); // Assuming expertise is a comma-separated string
      mentor.yearsOfExperience = yearsOfExperience;
      mentor.experienceCertificate = file.path; // Save the uploaded certificate
      mentor.calendlyLink = calendlyLink;
      mentor.isOnboardingFormSubmited = true; // Update the field to true

  
      // Save updated mentor details

      await mentor.save();
  
      req.flash('success', 'Onboarding submitted successfully. Your account is under review.');

      res.redirect('/mentor'); // Redirect to mentor dashboard or another page
    } catch (error) {
      req.flash('error', error.message);
      res.redirect('/onboarding');
    }
  };
  