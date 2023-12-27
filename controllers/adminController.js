const AdminModel = require("../models/adminModel");
const hashPassword = require("../helpers/helper");
const UserModel = require("../models/userModel");
const userModel = require("../models/userModel");

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

    const user = await AdminModel.findOne({ email });

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

const userListPageController = async (req, res) => {
  try {
    const user = await UserModel.find();
    console.log(user);

    res.render("adminPages/userList");
  } catch (error) {
    console.log(error);
  }
};

const userListController = async (req, res) => {
  try {
    if (!req.session.allUser) {
      const users = await UserModel.find();
      res.render("adminPages/userList", { users });
    } else {
      res.render("adminPages/userList", { users: req.session.allUser });
    }
    req.session.allUser = null;
    req.session.save();
  } catch (error) {
    console.log(error);
  }
};

const blockUserController = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findByIdAndUpdate(id, { isBlocked: true });
    res.redirect("/user-list");
  } catch (error) {
    console.log(error);
  }
};
const unblockUserController = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findByIdAndUpdate(id, { isBlocked: false });
    res.redirect("/user-list");
  } catch (error) {
    console.log(error);
  }
};

const deleteUserController = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findByIdAndDelete(id);
    res.redirect("/user-list");
  } catch (error) {
    console.log(error);
  }
};

const searchUserController = async (req, res) => {
  try {
    const { search } = req.body;
    const users = await UserModel.find({
      $or: [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
      ],
    });
    req.session.allUser = users;
    res.redirect("/user-list");
  } catch (error) {
    console.log(error);
  }
};

const filterUserController = async (req, res) => {
  try {
    const { filter } = req.body;
    console.log("value : ", filter);
    let users;
    if (filter === "active") {
      users = await UserModel.find({ isBlocked: false });
    } else {
      users = await UserModel.find({ isBlocked: true });
    }
    req.session.allUser = users;
    res.redirect("/user-list");
    // res.render("adminPages/userList", { users });
  } catch (error) {
    console.log(error);
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
  userListPageController,
  userListController,
  blockUserController,
  unblockUserController,
  deleteUserController,
  searchUserController,
  filterUserController,
  adminLogoutController,
};
