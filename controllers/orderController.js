const { AddressModel } = require("../models/addressModel");
const CartModel = require("../models/cartModel");
const OrderModel = require("../models/orderModel");

const getOrderPage = async (req, res) => {
  try {
    res.render("userPages/orderConfirm", {
      signIn: req.session.signIn,
      order: req.session.ordereditems,
    });
  } catch (error) {
    console.log(error);
  }
};

const checkoutController = async (req, res) => {
  try {
    const user = req.session.user._id;
    const { addressId, paymentMethod } = req.body;
    // console.log(req.body);
    // let paymentMethod;
    // if (cashOnDelivery) {
    //   paymentMethod = "cash_on_delivery";
    // }
    // if (creditCard) {
    //   paymentMethod = "creditcard";
    // }
    // if (upi) {
    //   paymentMethod = "upi";
    // }

    const address = await AddressModel.findOne({ _id: addressId });
    let products = await CartModel.find({ user }).populate("product");
    products = JSON.parse(JSON.stringify(products));
    let totalPrice = 0;

    for (let i = 0; i < products.length; i++) {
      totalPrice += products[i].product.price * products[i].quantity;
    }

    const allOrders = await OrderModel.find();

    const orderNumber = allOrders.length + 1;

    const order = await new OrderModel({
      orderNumber,
      user,
      products,
      address,
      paymentMethod,
      totalPrice,
    }).save();

    req.session.ordereditems = order;
    const deleteCart = await CartModel.deleteMany({ user });
    res.redirect("/order-complete");
  } catch (error) {
    console.log("error in checkout", error);
    res.redirect("/cart");
  }
};



module.exports = { checkoutController, getOrderPage };
