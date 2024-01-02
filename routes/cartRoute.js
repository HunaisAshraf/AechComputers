const express = require("express");
const requireSignIn = require("../middlewares/userMiddleware");
const {
  getCartPage,
  addToCartController,
  updateCartController,
} = require("../controllers/cartController");
const router = express.Router();

router.get("/cart", requireSignIn, getCartPage);

router.post("/add-to-cart/:id", requireSignIn, addToCartController);
router.post("/update-cart", requireSignIn, updateCartController);

module.exports = router;
