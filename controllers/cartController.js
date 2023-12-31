const { AddressModel } = require("../models/addressModel");
const CartModel = require("../models/cartModel");
const productModel = require("../models/productModel");

const getCartPage = async (req, res) => {
  try {
    const { id } = req.session.user;
    let cartProducts = await CartModel.find(id).populate("product");

    let totalPrice = 0;
    for (let product of cartProducts) {
      totalPrice += product?.product?.price * product?.quantity;
    }

    res.render("userPages/cart", {
      signIn: req.session.signIn,
      cartProducts: cartProducts,
      totalPrice,
    });
  } catch (error) {
    console.log(error);
  }
};

const addToCartController = async (req, res) => {
  try {
    const product = req.params.id;
    const quantity = parseInt(req.body.quantity);
    const user = req.session.user._id;
    const checkProduct = await productModel.findOne({ _id: product });
    const foundProduct = await CartModel.findOne({ product });
    const foundUser = await CartModel.findOne({ user });

    if (foundProduct && foundUser) {
      if (foundProduct.quantity + quantity <= checkProduct.quantity) {
        foundProduct.quantity += quantity;
      } else {
        res.redirect(`/product/${product}`);
      }
      foundProduct.save();
      res.redirect("/cart");
    } else {
      const cart = await new CartModel({
        user,
        product,
        quantity,
      }).save();

      res.redirect("/cart");
    }
  } catch (error) {
    console.log("error in adding to cart", error);
  }
};

const updateCartController = async (req, res) => {
  try {
    const product = req.body.product;
    const quantity = Number(req.body.quantity);

    const response = await CartModel.updateOne(
      { $and: [{ user: req.session.user._id }, { product }] },
      { $set: { quantity } }
    );

    const cartProducts = await CartModel.find({
      user: req.session.user._id,
    }).populate("product");
    res.status(200).json({
      success: true,
      products: cartProducts,
    });
  } catch (error) {
    console.error("error in updating cart ", error);
    res.status(500).json({ success: false });
  }
};

const deleteCartController = async (req, res) => {
  try {
    console.log(req.params);
    const { id } = req.params;

    const cart = await CartModel.findByIdAndDelete(id);

    res.redirect("/cart");
  } catch (error) {
    console.log(error);
  }
};

const getAdressPage = async (req, res) => {
  try {
    const addresses = await AddressModel.find({user_id:req.session.user._id});
    res.render("userPages/addresspage", {
      signIn: req.session.signIn,
      addresses,
    });
  } catch (error) {
    console.log(error);
  }
};

const addAdressController = async (req, res) => {
  try {
    const user_id = req.session.user._id;
    const { name, phone, houseNo, city, state, pincode } = req.body;

    const address = await new AddressModel({
      user_id,
      name,
      phone,
      houseNo,
      city,
      state,
      pincode,
    }).save();
    res.redirect("/address");
  } catch (error) {
    console.log(error);
  }
};

const updateAdressController = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.session.user._id;
    const { name, phone, houseNo, city, state, pincode } = req.body;
    const address = await AddressModel.findByIdAndUpdate(id, {
      user_id,
      name,
      phone,
      houseNo,
      city,
      state,
      pincode,
    });
    res.redirect("/address");
  } catch (error) {
    console.log("error in updating address ", error);
  }
};

const deleteAddressController = async (req, res) => {
  try {
    const { id } = req.params;
    const address = await AddressModel.findByIdAndDelete(id);
    res.redirect("/address");
  } catch (error) {
    console.log("error in deleting address ", error);
  }
};

module.exports = {
  getCartPage,
  addToCartController,
  updateCartController,
  deleteCartController,
  getAdressPage,
  addAdressController,
  updateAdressController,
  deleteAddressController,
};
