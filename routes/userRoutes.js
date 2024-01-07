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
} = require("../controllers/userController");
const requireSignIn = require("../middlewares/userMiddleware");

const router = express.Router();

router.get("/", getHomeController);
router.get("/shop", getShopPage);
router.get("/shop/:id", filterCategoryPage);
router.post("/filter-category", filterProductByCAtegory);
router.post("/filter-price", filterProductByPrice);
router.get("/product/:id", getProductPage);
router.get("/profile",requireSignIn,getUserProfileController)

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


router.post("/edit-user",requireSignIn,editUserinfoController)
//logout routes
router.get("/logout", userLogoutController);

module.exports = router;
