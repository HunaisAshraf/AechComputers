const express = require("express");
const requireSignIn = require("../middlewares/userMiddleware");
const {
  getCartPage,
  addToCartController,
  updateCartController,
  getAdressPage,
  addAdressController,
  updateAdressController,
  deleteAddressController,
} = require("../controllers/cartController");
const { checkoutController, getOrderPage } = require("../controllers/orderController");
const router = express.Router();

router.get("/cart", requireSignIn, getCartPage);

router.post("/add-to-cart/:id", requireSignIn, addToCartController);
router.post("/update-cart", requireSignIn, updateCartController);

router.get("/address", requireSignIn, getAdressPage);
router.post("/add-address", requireSignIn, addAdressController);
router.post("/update-address/:id", requireSignIn, updateAdressController);
router.get("/delete-address/:id", requireSignIn, deleteAddressController);


// orders route
router.post("/checkout", requireSignIn, checkoutController);
router.get("/order-complete", requireSignIn, getOrderPage);

module.exports = router;
