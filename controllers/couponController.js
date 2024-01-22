const CouponModel = require("../models/couponModel");

const getCouponPage = async (req, res) => {
  try {
    const coupons = await CouponModel.find();
    res.render("adminPages/couponList", { coupons });
  } catch (error) {
    console.log(error);
  }
};

const addCouponController = async (req, res) => {
  try {
    const { couponCode, discountAmount, startDate, endDate } = req.body;
    const coupon = await new CouponModel({
      couponCode,
      discountAmount,
      startDate,
      endDate,
    }).save();
    res.status(200).send({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false });
  }
};

const editCouponController = async (req, res) => {
  try {
    console.log(req.body);
    const { id, couponCode, discountAmount, startDate, endDate } = req.body;
    const coupon = await CouponModel.findByIdAndUpdate(id, {
      couponCode,
      discountAmount,
      startDate,
      endDate,
    });
    res.redirect("/coupon-list");
  } catch (error) {
    console.log(error);
  }
};

const editCouponStatusController = async (req, res) => {
  try {
    const { id } = req.body;

    const coupon = await CouponModel.findOne({ _id: id });

    if (coupon.isAvailable) {
      coupon.isAvailable = false;
      coupon.save();
    } else {
      coupon.isAvailable = true;
      coupon.save();
    }
    res.status(200).send({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false });
  }
};

module.exports = {
  getCouponPage,
  addCouponController,
  editCouponController,
  editCouponStatusController,
};
