const AdminModel = require("../models/adminModel");
const hashPassword = require("../helpers/helper");
const UserModel = require("../models/userModel");
const OrderModel = require("../models/orderModel");
const ProductModel = require("../models/productModel");

const adminLoginPageController = async (req, res) => {
  if (!req.session.admin) {
    res.render("adminPages/adminLogin", { invalid: req.session.inValid });
  } else {
    res.redirect("/admin-dashboard");
  }
  req.session.inValid = null;
  req.session.save();
};

const getAdminDashboard = async (req, res) => {
  try {
    const order = await OrderModel.find();
    const orderCount = order.length;
    const revenue = order.reduce((acc, curr) => (acc += curr.totalPrice), 0);
    const productCount = await ProductModel.find().count();
    const userCount = await UserModel.find().count();
    const paymentMethod = await OrderModel.aggregate([
      {
        $group: {
          _id: "$paymentMethod",
          amount: {
            $sum: "$totalPrice",
          },
        },
      },
    ]);
    res.render("adminPages/adminDashboard", {
      user: req.session.adminInfo,
      revenue,
      orderCount,
      productCount,
      userCount,
      payMethod: JSON.stringify(paymentMethod),
    });
  } catch (error) {
    console.log(error);
  }
};

const chartDataController = async (req, res) => {
  try {
    const order = await OrderModel.find();
    const orderCount = order.length;
    const revenue = order.reduce((acc, curr) => (acc += curr.totalPrice), 0);
    const productCount = await ProductModel.find().count();
    const userCount = await UserModel.find().count();
    const paymentMethod = await OrderModel.aggregate([
      {
        $group: {
          _id: "$paymentMethod",
          amount: {
            $sum: "$totalPrice",
          },
          count: {
            $sum: 1,
          },
        },
      },
    ]);
    const category = await OrderModel.aggregate([
      {
        $unwind: "$products",
      },
      {
        $group: {
          _id: "$products.product.category",
          amount: {
            $sum: "$totalPrice",
          },
          count: {
            $sum: 1,
          },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "products.product.category",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      {
        $unwind: "$categoryInfo",
      },
      {
        $project: {
          _id: 0,
          categoryName: "$categoryInfo.categoryName",
          totalQuantity: 1,
          totalPrice: 1,
        },
      },
    ]);

    res.json({
      orderCount,
      revenue,
      productCount,
      userCount,
      paymentMethod,
      category,
    });
  } catch (error) {
    console.log(error);
  }
};

const adminLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === "") {
      req.session.inValid = true;
      res.redirect("/admin-login");
    }
    if (password === "") {
      req.session.inValid = true;
      res.redirect("/admin-login");
    }

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
      req.session.inValid = true;
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
  getAdminDashboard,
  userListPageController,
  userListController,
  blockUserController,
  unblockUserController,
  deleteUserController,
  searchUserController,
  filterUserController,
  adminLogoutController,
  chartDataController,
};
