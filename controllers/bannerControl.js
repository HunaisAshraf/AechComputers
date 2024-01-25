const BannerModel = require("../models/bannerModel");

const getBannerPage = async (req, res) => {
  try {
    let page = Number(req.query.page) || 1;
    let limit = 5;
    let skip = (page - 1) * limit;
    const count = await BannerModel.find().estimatedDocumentCount();
    const banner = await BannerModel.find();
    res.render("adminPages/bannerList", { banner, count, limit });
  } catch (error) {
    console.log(error);
  }
};

const getAddBannerPage = (req, res) => {
  res.render("adminPages/addBanner");
};

const addBannerController = async (req, res) => {
  try {
    console.log(req.files);
    const image = req.files[0].filename;

    await new BannerModel({ image }).save();

    res.status(200).send({ success: true });
    // res.redirect("/banner-list");
  } catch (error) {
    console.log("error in adding banner ", error);
  }
};

module.exports = { getBannerPage, getAddBannerPage, addBannerController };
