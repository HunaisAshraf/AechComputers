const BannerModel = require("../models/bannerModel");

const getBannerPage = async (req, res) => {
  try {
    const banner = await BannerModel.find();
    console.log(banner);
    res.render("adminPages/bannerList", { banner });
  } catch (error) {
    console.log(error);
  }
};

const getAddBannerPage = (req, res) => {
  res.render("adminPages/addBanner");
};

const addBannerController = async (req, res) => {
  try {
    console.log(req.files)
    const image = req.files[0].filename;

    await new BannerModel({ image }).save();

    res.status(200).send({success:true})
    // res.redirect("/banner-list");
  } catch (error) {
    console.log("error in adding banner ", error);
  }
};

module.exports = { getBannerPage, getAddBannerPage, addBannerController };
