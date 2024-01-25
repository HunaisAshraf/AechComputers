const OrderModel = require("../models/orderModel");

const getOrderList = async (req, res) => {
  try {
    let orders;
    let count;
    let page = Number(req.query.page) || 1;
    let limit = 5;
    let skip = (page - 1) * limit;
    if (req.session.orderList) {
      orders = req.session.orderList;
    } else {
      count = await OrderModel.find().estimatedDocumentCount();

      orders = await OrderModel.find().skip(skip).limit(limit);
    }
    res.render("adminPages/orderList", { orders, count, limit });
    req.session.orderList = null;
    req.session.save();
  } catch (error) {
    console.log(error);
  }
};

const orderStatusController = async (req, res) => {
  try {
    console.log(req.body);
    const { orderId, selectedStatus } = req.body;

    const order = await OrderModel.findByIdAndUpdate(orderId, {
      status: selectedStatus,
    });
    res.redirect("/order-list");
  } catch (error) {
    console.log(error);
  }
};

const filterStatusContoller = async (req, res) => {
  try {
    const status = req.body.filter;

    const orders = await OrderModel.find({ status });
    req.session.orderList = orders;
    res.redirect("order-list");
  } catch (error) {
    console.log(error);
  }
};

const searchOrderContoller = async (req, res) => {
  try {
    const { search } = req.body;
    const orders = await OrderModel.find({
      $or: [{ "address.name": { $regex: search, $options: "i" } }],
    });
    req.session.orderList = orders;

    res.redirect("/order-list");
  } catch (error) {
    console.log(error);
  }
};

const getAdminOrderDetailsPage = async (req, res) => {
  try {
    const { id } = req.params;
    let order = await OrderModel.findOne({ _id: id }).populate("products");
    order = JSON.parse(JSON.stringify(order));

    res.render("adminPages/orderDetails", { order });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getOrderList,
  orderStatusController,
  filterStatusContoller,
  searchOrderContoller,
  getAdminOrderDetailsPage,
};
