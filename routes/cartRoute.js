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
const router = express.Router();

router.get("/cart", requireSignIn, getCartPage);

router.post("/add-to-cart/:id", requireSignIn, addToCartController);
router.post("/update-cart", requireSignIn, updateCartController);


router.get("/address",requireSignIn,getAdressPage)
router.post("/add-address",requireSignIn,addAdressController)
router.post("/update-address/:id",requireSignIn,updateAdressController)
router.get("/delete-address/:id",requireSignIn,deleteAddressController)
// router.get("/checkout",)

module.exports = router;
