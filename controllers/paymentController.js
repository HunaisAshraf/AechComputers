const Razorpay = require("razorpay");
const dotenv = require("dotenv");
const WalletModel = require("../models/walletModel");
const createInvoice = require("../helpers/generatePdf");
const orderModel = require("../models/orderModel");

dotenv.config();

var instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

const createOrder = async (req, res) => {
  try {
    const amount = Number(req.body.amount);
    instance.orders
      .create({
        amount: amount,
        currency: "INR",
        receipt: "receipt#1",
      })
      .then((order) => {
        return res.send({ orderId: order.id });
      })
      .catch((err) => console.log(err));
  } catch (error) {
    console.log(error);
  }
};

const getWalletBalance = async (req, res) => {
  try {
    const wallet = await WalletModel.findOne({ user: req.session.user._id });
    res.json({ balance: wallet.balance });
  } catch (error) {
    console.log(error);
  }
};

const invoiceDownloadController = async (req, res) => {
  try {
    const {id} = req.params;

    const order = await orderModel.findOne ({_id:id});

    const stream = res.writeHead(200, {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment;filename=invoice.pdf",
    });

    createInvoice(
      (chunk) => stream.write(chunk),
      () => stream.end(),
      order
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports = { createOrder, getWalletBalance,invoiceDownloadController };
