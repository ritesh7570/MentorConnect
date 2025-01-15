module.exports = (req, res, next) => {
  // console.log("Current User:", req.user); // Debugging statement
  res.locals.currUser = req.user;
  res.locals.userRole = req.user?.role || "mentee";  // Default role "mentee" if no role is present
  res.locals.messages = {
    success: req.flash("success"),
    error: req.flash("error"),
    info: req.flash("info"),
  };
  next();
};

