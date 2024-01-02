const requireSignIn = (req, res, next) => {
  if (req.session.signIn) {
    next();
  } else {
    res.redirect("/signin");
  }
};

module.exports = requireSignIn;
