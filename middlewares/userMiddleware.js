const userModel = require("../models/userModel");

const requireSignIn = (req, res, next) => {
  if (req.session.signIn) {
    next();
  } else {
    res.redirect("/signin");
  }
};

const notBlocked = async (req, res, next) => {
  try {
    const user = await userModel.findOne({ _id: req.session.user._id });

    if (user.isBlocked) {
      res.redirect("/signin");
      req.session.signIn = false;
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { requireSignIn, notBlocked };
