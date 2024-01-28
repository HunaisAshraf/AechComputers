const CouponModel = require("../models/couponModel");

const getCouponPage = async (req, res) => {
  try {
    let page = Number(req.query.page) || 1;
    let limit = 5;
    let skip = (page - 1) * limit;

    const coupons = await CouponModel.find();
    const count = await CouponModel.find().estimatedDocumentCount();
    res.render("adminPages/couponList", { coupons, count, limit });
  } catch (error) {
    console.log(error);
  }
};

const addCouponController = async (req, res) => {
  try {
    const { couponCode, discountAmount, startDate, endDate } = req.body;

    const couponExist = await CouponModel.findOne({ couponCode });
    if (couponExist) {
      return res.status(500).send({ exist: true });
    }

    const coupon = await new CouponModel({
      couponCode,
      discountAmount,
      startDate,
      endDate,
    }).save();
    return res.status(200).send({ success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false });
  }
};

const editCouponController = async (req, res) => {
  try {
    const { id, couponCode, discountAmount, startDate, endDate } = req.body;

    const couponExist = await CouponModel.findOne({ couponCode });

    if (!couponExist || String(couponExist._id) === id) {

      const coupon = await CouponModel.findByIdAndUpdate(id, {
        couponCode,
        discountAmount,
        startDate,
        endDate,
      });
    }
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
