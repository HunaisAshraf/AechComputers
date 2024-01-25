const AdminModel = require("../models/adminModel");
const hashPassword = require("../helpers/helper");
const UserModel = require("../models/userModel");
const OrderModel = require("../models/orderModel");
const ProductModel = require("../models/productModel");
const exceljs = require("exceljs");
const fs = require("node:fs");

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

    if (!user) {
      req.session.inValid = true;
      res.redirect("/admin-login");
    }
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
    let users;
    let count;
    let page = Number(req.query.page) || 1;
    let limit = 2;
    let skip = (page - 1) * limit;
    if (!req.session.allUser) {
      count = await UserModel.find().estimatedDocumentCount();
      users = await UserModel.find().skip(skip).limit(limit);
    } else {
      users = req.session.allUser;
      // res.render("adminPages/userList", { users: req.session.allUser });
    }
    res.render("adminPages/userList", { users, count, limit });
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

const getSalesReport = async (req, res) => {
  try {
    let sales;
    if (req.session.sales) {
      sales = req.session.sales;
    } else {
      sales = await OrderModel.find();
    }
    res.render("adminPages/salesReport", {
      sales,
      date: req.session.salesFilterDate,
    });
  } catch (error) {
    console.log(error);
  }
};

const filterSalesReport = async (req, res) => {
  try {
    let { startDate, endDate } = req.body;

    let sales = await OrderModel.find({
      createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
    });

    req.session.sales = sales;
    req.session.salesFilterDate = req.body;
    res.redirect("/sales-report");
  } catch (error) {
    console.log(error);
  }
};

const downloadSalesReport = async (req, res) => {
  try {
    const workBook = new exceljs.Workbook();
    const sheet = workBook.addWorksheet("book");
    sheet.columns = [
      { header: "No", key: "no", width: 10 },
      { header: "Name", key: "name", width: 25 },
      { header: "Products", key: "products", width: 35 },
      { header: "Price", key: "price", width: 25 },
      { header: "Payment Method", key: "paymentMethod", width: 25 },
      { header: "Order Date", key: "orderDate", width: 25 },
      { header: "Status", key: "status", width: 20 },
    ];

    const { startDate, endDate } = req.session.salesFilterDate;

    const orders = await OrderModel.find({
      createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
    });

    orders.map((order, i) => {
      sheet.addRow({
        no: order.orderNumber,
        name: order.address.name,
        products: order.products
          .map((product) => product.product.productName)
          .join(", "),
        price: `₹ ${new Intl.NumberFormat().format(order.totalPrice)}`,
        paymentMethod: order.paymentMethod,
        orderDate: order.createdAt.toLocaleString(),
        status: order.status,
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=salesReport.xlsx"
    );

    workBook.xlsx.write(res);
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
  getSalesReport,
  downloadSalesReport,
  filterSalesReport,
};
