const Razorpay = require("razorpay");
const dotenv = require("dotenv");

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

module.exports = { createOrder };
