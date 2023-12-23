const UserModel = require("../models/adminModel");
const hashPassword = require("../helpers/helper");

const adminLoginPageController = async (req, res) => {
  if (!req.session.admin) {
    res.render("adminPages/adminLogin");
  } else {
    res.redirect("/admin-dashboard");
  }
};

const getHomeController = async (req, res) => {
  res.render("adminPages/adminDashboard", { user: req.session.adminInfo });
};

const adminLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    const matchPassword = await hashPassword.comparePassword(
      password,
      user.password
    );
    if (matchPassword) {
      req.session.admin = true;
      req.session.adminInfo = user;
      res.redirect("/admin-dashboard");
    } else {
      res.redirect("/admin-login");
    }
  } catch (error) {
    console.log(`error in admin login ${error}`);
  }
};

const adminLogoutController = (req, res) => {
  try {
    req.session.admin = null;
    res.redirect("/admin-login");
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  adminLoginPageController,
  adminLoginController,
  getHomeController,
  adminLogoutController,
};
