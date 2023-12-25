const { validateEmail, getOtp, hashPassword } = require("../helpers/helper");
const otpSender = require("../helpers/sendOtpHelper");
const userModel = require("../models/userModel");

const getHomeController = async (req, res) => {
  res.send("home");
};

const getUserLoginController = (req, res) => {
  res.render("userPages/userLogin", { signIn: req.session.signIn });
};
const getUserSignupController = (req, res) => {
  res.render("userPages/userSignUp", {
    signIn: req.session.signIn,
    inputErr: req.session.inputErr,
    errMsg: req.session.errMsg,
  });
};

const sendOtp = async (req, res, next) => {
  try {
    const { firstName, email } = req.session.user;

    const otp = getOtp();
    req.session.otp = otp;

    const send = await otpSender(firstName, email, otp);

    next();
  } catch (error) {
    console.log(error);
  }
};

const userSignupController = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, password, confirmPassword } =
      req.body;

    const errMsg = {};
    req.session.inputErr = false;
    if (firstName === "" || !/^[A-Za-z]+$/.test(firstName)) {
      errMsg["firstName"] = "First Name is not valid";
      req.session.inputErr = true;
    }
    if (lastName === "" || !/^[A-Za-z]+$/.test(lastName)) {
      errMsg["lastName"] = "Last Name is not valid";
      req.session.inputErr = true;
    }
    if (!validateEmail(email)) {
      errMsg["email"] = "Email is not valid";
      req.session.inputErr = true;
    }

    if (phone.length < 10 || phone.length > 10) {
      errMsg["phone"] = "Number is not valid";
      req.session.inputErr = true;
    }
    if (password.length < 6) {
      errMsg["password"] = "Password should be grater than 6 character";
      req.session.inputErr = true;
    }
    if (confirmPassword !== password) {
      errMsg["confirmPassword"] = "Password dosen't match";
      req.session.inputErr = true;
    }

    if (req.session.inputErr) {
      req.session.errMsg = errMsg;
      res.redirect("/signup");
    } else {
      req.session.user = {
        firstName,
        lastName,
        email,
        phone,
        password,
        confirmPassword,
      };
      next();
    }
  } catch (error) {
    console.log(error);
  }
};

const getOtpVerifyPage = async (req, res) => {
  try {
    setTimeout(() => {
      req.session.otp = null;
      console.log("otp expired ", req.session.otp);
    }, 1000 * 60);
    
    res.render("userPages/otpVerify", {
      signIn: req.session.signIn,
      inValidOTP: req.session.inValidOtp,
    });
  } catch (error) {
    console.log(error);
  }
};

const otpVerify = async (req, res, next) => {
  try {
    const { otp } = req.body;

    if (otp !== "" && otp == req.session.otp) {
      next();
    } else {
      req.session.inValidOtp = true;
      res.redirect("/verify-otp");
    }
  } catch (error) {
    console.log(error);
  }
};

const addUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, password } = req.session.user;
    const hashedPassword = await hashPassword(password);

    const user = await new userModel({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
    }).save();
    console.log(user);
    res.redirect("/signin");
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getUserLoginController,
  getUserLoginController,
  userSignupController,
  getUserSignupController,
  getOtpVerifyPage,
  otpVerify,
  sendOtp,
  addUser,
};
