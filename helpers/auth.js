module.exports = {
  ensureAuthentication: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error_msg", "not authorized");
    res.resdirect("/users/login");
  }
};
