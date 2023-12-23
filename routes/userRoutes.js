const express = require("express");
const {
  getUserLoginController,
  getUserSignupController,
  userSignupController,
  otpVerifyPage
} = require("../controllers/userController");

const router = express.Router();

router.get("/signin", getUserLoginController);
router.get("/signup", getUserSignupController);
router.post("/signup", userSignupController);
router.get("/otp", otpVerifyPage);

module.exports = router;
