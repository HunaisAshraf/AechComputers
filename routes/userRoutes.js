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
} = require("../controllers/userController");

const router = express.Router();

router.get("/", getHomeController);

//login routes
router.get("/signin", getUserLoginController);
router.post("/signin", userLoginController);

// signup routes
router.get("/signup", getUserSignupController);
router.post("/signup", userSignupController, sendOtp, getOtpVerifyPage);
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

//logout routes
router.get("/logout", userLogoutController);

module.exports = router;
