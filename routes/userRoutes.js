const express = require("express");
const {
  getUserLoginController,
  getUserSignupController,
  userSignupController,
  getOtpVerifyPage,
  otpVerify,
  sendOtp,
  addUser,
} = require("../controllers/userController");

const router = express.Router();

router.get("/signin", getUserLoginController);
router.get("/signup", getUserSignupController);
router.post("/signup", userSignupController, sendOtp, getOtpVerifyPage);
router.get("/verify-otp", getOtpVerifyPage);
router.post("/verify-otp", otpVerify,addUser);
router.get("/resend-otp", sendOtp, getOtpVerifyPage);

module.exports = router;
