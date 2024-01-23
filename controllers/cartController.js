const { AddressModel } = require("../models/addressModel");
const CartModel = require("../models/cartModel");
const productModel = require("../models/productModel");

const getCartPage = async (req, res) => {
  try {
    let cartProducts = await CartModel.find({
      user: req.session.user._id,
    }).populate("product");

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
    const foundUser = await CartModel.findOne({ user: req.session.user._id });

    if (foundProduct && foundUser) {
      if (foundProduct.quantity + quantity <= checkProduct.quantity) {
        foundProduct.quantity += quantity;
      } else {
        res.redirect(`/product/${product}`);
      }
      foundProduct.save();
      // res.redirect("/cart");
      return res.status(200).send({ success: true });
    } else {
      const cart = await new CartModel({
        user,
        product,
        quantity,
      }).save();

      return res.status(200).send({ success: true });
      // res.redirect("/cart");
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
    const { id } = req.params;

    const cart = await CartModel.findByIdAndDelete(id);
    res.status(200).send({ success: true });
    // res.redirect("/cart");
  } catch (error) {
    console.log(error);
  }
};

const getAdressPage = async (req, res) => {
  try {
    const cart = await CartModel.find({
      user: req.session.user._id,
    }).populate("product");

    let totalPrice = 0;

    for (let product of cart) {
      totalPrice += product?.product?.price * product?.quantity;
    }

    const addresses = await AddressModel.find({
      user_id: req.session.user._id,
    });

    if (addresses.length > 0) {
      res.render("userPages/checkoutPage", {
        signIn: req.session.signIn,
        addresses,
        totalPrice,
      });
    } else {
      res.render("userPages/addAddress", { signIn: req.session.signIn });
    }
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
    // res.redirect("/address");
    res.status(200).send({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error });
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
    res.status(200).send({ success: true });
    // res.redirect("/address");
  } catch (error) {
    console.log("error in updating address ", error);
    res.status(500).send({ success: false });
  }
};

const deleteAddressController = async (req, res) => {
  try {
    const { id } = req.params;
    const address = await AddressModel.findByIdAndDelete(id);
    // res.redirect("/address");
    res.status(200).send({ success: true });
  } catch (error) {
    console.log("error in deleting address ", error);
    res.status(500).send({ success: false });
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
