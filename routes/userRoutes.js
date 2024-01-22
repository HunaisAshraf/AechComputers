const express = require("express");
const {
  getUserLoginController,
  getUserSignupController,
  userSignupController,
  getOtpVerifyPage,
  otpVerify,
  sendOtp,
  addUser,
  userLoginController,
  getHomeController,
  userLogoutController,
  getForgetpageController,
  forgetPasswordController,
  getForgetOtpController,
  getUpdatePasswordController,
  forgetpasswordOtpVerify,
  sendForgetOtp,
  updatePasswordController,
  getShopPage,
  getProductPage,
  getUserProfileController,
  filterCategoryPage,
  filterProductByCAtegory,
  filterProductByPrice,
  editUserinfoController,
  getUserAddressController,
  getUserOrdersController,
  editUserPasswordController,
} = require("../controllers/userController");
const { requireSignIn } = require("../middlewares/userMiddleware");
const {
  cancelOrderController,
  getOrderPage,
  checkoutController,
  applyCouponController,
} = require("../controllers/orderController");
const {
  getCartPage,
  addToCartController,
  updateCartController,
  deleteCartController,
  getAdressPage,
  addAdressController,
  updateAdressController,
  deleteAddressController,
} = require("../controllers/cartController");
const {
  createOrder,
  getWalletBalance,
} = require("../controllers/paymentController");

const router = express.Router();

router.get("/", getHomeController);
router.get("/shop", getShopPage);
router.get("/shop/:id", filterCategoryPage);
router.post("/filter-category", filterProductByCAtegory);
router.post("/filter-price", filterProductByPrice);
router.get("/product/:id", getProductPage);
router.get("/user/profile", requireSignIn, getUserProfileController);
router.get("/user/address", requireSignIn, getUserAddressController);
router.get("/user/orders", requireSignIn, getUserOrdersController);
router.post("/user/edit-user", requireSignIn, editUserinfoController);
router.post("/user/edit-password", requireSignIn, editUserPasswordController);

//login routes
router.get("/signin", getUserLoginController);
router.post("/signin", userLoginController);

// signup routes
router.get("/signup", getUserSignupController);
router.post("/signup", userSignupController, sendOtp);
router.get("/verify-otp", getOtpVerifyPage);
router.post("/verify-otp", otpVerify, addUser);
router.get("/resend-otp", sendOtp, getOtpVerifyPage);

// forget password routed
router.get("/forget-password", getForgetpageController);
router.post("/forget-password", forgetPasswordController, sendForgetOtp);
router.get("/forgetpassword-otp", getForgetOtpController);
router.post("/forgetpassword-otp", forgetpasswordOtpVerify);
router.get("/update-password", getUpdatePasswordController);
router.post("/update-password", updatePasswordController);
router.get("/resend-forgetotp", sendForgetOtp);

//cart
router.get("/cart", requireSignIn, getCartPage);
router.post("/add-to-cart/:id", requireSignIn, addToCartController);
router.post("/update-cart", requireSignIn, updateCartController);
router.get("/delete-cart/:id", requireSignIn, deleteCartController);

//address
router.get("/address", requireSignIn, getAdressPage);
router.post("/add-address", requireSignIn, addAdressController);
router.put("/update-address/:id", requireSignIn, updateAdressController);
router.delete("/delete-address/:id", requireSignIn, deleteAddressController);

//order and payment
router.post("/checkout", requireSignIn, checkoutController);
router.post("/apply-coupon", requireSignIn, applyCouponController);
router.get("/order-complete", requireSignIn, getOrderPage);
router.get(
  "/order-cancel/:id",
  requireSignIn,
  cancelOrderController
);
router.post("/create-order", requireSignIn, createOrder);
router.get("/wallet-balance", requireSignIn, getWalletBalance);

//logout routes
router.get("/logout", userLogoutController);

module.exports = router;
