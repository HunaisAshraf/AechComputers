const CartModel = require("../models/cartModel");

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

    const foundProduct = await CartModel.findOne({ product });
    const foundUser = await CartModel.findOne({ user });
    console.log(product);

    if (foundProduct && foundUser) {
      foundProduct.quantity += quantity;
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
    console.log(quantity);
    const response = await CartModel.updateOne(
      { $and: [{ user: req.session.user._id }, { product }] },
      { $set: { quantity } }
    );
    console.log(response);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("error in updating cart ", error);
    res.status(500).json({ success: false });
  }
};

module.exports = { getCartPage, addToCartController, updateCartController };
