const wishListModel = require("../models/wishListModel");

const getWishList = async (req, res) => {
  try {
    const products = await wishListModel
      .find({ user: req.session.user._id })
      .populate("product");

    res.render("userPages/wishList", { signIn: req.session.signIn, products });
  } catch (error) {
    console.log(error);
  }
};

const addToWishlistController = async (req, res) => {
  try {
    const { id } = req.params;

    const exist = await wishListModel.findOne({ product: id });

    if (exist) {
      return res.status(500).send({ exist: true });
    } else {
      await new wishListModel({
        user: req.session.user._id,
        product: id,
      }).save();
      return res.status(200).send({ success: true });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false });
  }
};

const removeFromWishList = async (req, res) => {
  try {
    const { id } = req.params;
    const wishlist = await wishListModel.deleteOne({
      user: req.session.user._id,
      product: id,
    });
    res.status(200).send({ success: true });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getWishList, addToWishlistController, removeFromWishList };
