const { AddressModel } = require("../models/addressModel");
const CartModel = require("../models/cartModel");
const OrderModel = require("../models/orderModel");
const WalletModel = require("../models/walletModel");

const Razorpay = require("razorpay");
const dotenv = require("dotenv");

dotenv.config();

var instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

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
    let { addressId, paymentMethod, totalPrice } = req.body;
    console.log("ffffffffffffffffffffffff", req.body);
    let paid;

    if (paymentMethod === "cashOnDelivery") {
      paid = false;
    } else if (paymentMethod === "wallet") {
      const wallet = await WalletModel.findOne({ user: req.session.user._id });
      wallet.balance -= totalPrice;
      wallet.save();
    } else {
      let order = await instance.payments.fetch(req.body.razorpay_payment_id);
      console.log(order);
      paid = true;
      addressId = order.notes.address;
      paymentMethod = order.method;
      totalPrice = Number(order.notes.totalPrice);
    }

    const address = await AddressModel.findOne({ _id: addressId });
    let products = await CartModel.find({ user }).populate("product");
    products = JSON.parse(JSON.stringify(products));
    // let totalPrice = 0;

    // for (let i = 0; i < products.length; i++) {
    //   totalPrice += products[i].product.price * products[i].quantity;
    // }

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
    console.log("ordered product ; ", order);
    req.session.ordereditems = order;
    const deleteCart = await CartModel.deleteMany({ user });

    if (paymentMethod === "wallet" || paymentMethod === "cashOnDelivery") {
      res.status(200).json({ success: true });
    } else {
      res.redirect("/order-complete");
    }
  } catch (error) {
    console.log("error in checkout", error);
    res.redirect("/cart");
  }
};

const cancelOrderController = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await OrderModel.findOne({ _id: id });

    if (order.paymentMethod !== "cashOnDelivery") {
      const wallet = await WalletModel.findOne({ user: req.session.user._id });
      if (!wallet) {
        await new WalletModel({
          user: req.session.user._id,
          balance: order.totalPrice,
        }).save();
      } else {
        wallet.balance += order.totalPrice;
        wallet.save();
      }
    }

    await OrderModel.findByIdAndUpdate(id, {
      status: "cancelled",
    });
    res.redirect("/profile");
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  checkoutController,
  getOrderPage,
  cancelOrderController,
};
