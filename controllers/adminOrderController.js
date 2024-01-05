const OrderModel = require("../models/orderModel");

const getOrderList = async (req, res) => {
  try {
    if (req.session.orderList) {
      res.render("adminPages/orderList", { orders: req.session.orderList });
    } else {
      const orders = await OrderModel.find();
      res.render("adminPages/orderList", { orders });
    }
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
      $or: [
        { "address.name": { $regex: search, $options: "i" } },
      ],
    });
    req.session.orderList = orders;

    res.redirect("/order-list");
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getOrderList,
  orderStatusController,
  filterStatusContoller,
  searchOrderContoller,
};
