const requireSignIn = (req, res) => {
  if (req.session.signIn) {
    next();
  } else {
    res.redirect("/login");
  }
};

module.exports = requireSignIn;
