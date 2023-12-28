const {
  validateEmail,
  getOtp,
  hashPassword,
  comparePassword,
} = require("../helpers/helper");
const BannerModel = require("../models/bannerModel");
const otpSender = require("../helpers/sendOtpHelper");
const userModel = require("../models/userModel");
const CategoryModel = require("../models/categoryModel");
const ProductModel = require("../models/productModel");

const getHomeController = async (req, res) => {
  try {
    const banners = await BannerModel.find();
    const categories = await CategoryModel.find();
    res.render("userPages/userHome", {
      signIn: req.session.signIn,
      banners,
      categories,
    });
  } catch (error) {
    console.log(error);
  }
};

const getShopPage = async (req, res) => {
  try {
    const products = await ProductModel.find();
    res.render("userPages/shopPage", {
      signIn: req.session.signIn,
      products,
    });
  } catch (error) {
    console.log(error);
  }
};

const getProductPage = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await ProductModel.findOne({ _id: id });
    res.render("userPages/productPage", {
      signIn: req.session.signin,
      product,
    });
  } catch (error) {
    console.log(error);
  }
};

const getUserLoginController = (req, res) => {
  try {
    if (!req.session.signIn) {
      res.render("userPages/userLogin", {
        signIn: req.session.signIn,
        userNotFound: req.session.userNotFound,
        invalidCredentials: req.session.invalidCredentials,
      });
      req.session.userNotFound = false;
      req.session.invalidCredentials = false;
      req.session.save();
    } else {
      res.redirect("/");
    }
  } catch (error) {
    console.log(error);
  }
};

const userLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email: email });

    if (!user) {
      req.session.userNotFound = true;
      res.redirect("/signin");
    }
    if (user.isBlocked) {
      req.session.userNotFound = true;
      res.redirect("/signin");
    }
    const passwordMatch = await comparePassword(password, user.password);

    if (!passwordMatch) {
      req.session.invalidCredentials = true;
      res.redirect("/signin");
    }

    req.session.signIn = true;
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
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
      otp: req.session.otp,
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

const getForgetpageController = async (req, res) => {
  if (req.session.signIn) {
    res.redirect("/");
  } else {
    res.render("userPages/forgetPassword", {
      signIn: req.session.signIn,
      notExist: req.session.notExists,
    });
  }
};

const forgetPasswordController = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });

    if (user) {
      req.session.user = req.body;
      next();
    } else {
      req.session.notExists = true;
      res.redirect("/forget-Password");
    }
  } catch (error) {
    console.log(error);
  }
};

const sendForgetOtp = async (req, res) => {
  const { email } = req.session.user;
  const otp = getOtp();
  req.session.otp = otp;
  const send = await otpSender(email, email, otp);

  if (send) {
    res.redirect("/forgetpassword-otp");
  }
};

const getForgetOtpController = (req, res) => {
  if (req.session.signIn) {
    res.redirect("/");
  } else {
    res.render("userPages/forgetPasswordOtp", {
      signIn: req.session.signIn,
      inValidOTP: req.session.inValidOtp,
      otp: req.session.otp,
    });
  }
};

const forgetpasswordOtpVerify = async (req, res, next) => {
  try {
    const { otp } = req.body;

    if (otp !== "" && otp == req.session.otp) {
      res.redirect("/update-password");
    } else {
      req.session.inValidOtp = true;
      res.redirect("/forgetpassword-otp");
    }
  } catch (error) {
    console.log(error);
  }
};

const getUpdatePasswordController = async (req, res) => {
  try {
    res.render("userPages/updatePassword", {
      signIn: req.session.signIn,
      inputErr: req.session.inputErr,
      errMsg: req.session.errMsg,
    });
  } catch (error) {
    console.log(error);
  }
};

const updatePasswordController = async (req, res) => {
  try {
    const { password, confirmPassword } = req.body;
    const { email } = req.session.user;
    console.log(email);
    const errMsg = {};
    req.session.inputErr = false;
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
      res.redirect("/update-password");
    } else {
      let hashedPassword = await hashPassword(password);
      let user = await userModel.findOneAndUpdate(
        { email },
        { password: hashedPassword }
      );
      res.redirect("/signin");
    }
  } catch (error) {
    console.log(error);
  }
};

const userLogoutController = (req, res) => {
  req.session.signIn = false;
  res.redirect("/");
};

module.exports = {
  getHomeController,
  getUserLoginController,
  userLoginController,
  userSignupController,
  getUserSignupController,
  getOtpVerifyPage,
  otpVerify,
  sendOtp,
  addUser,
  getForgetpageController,
  forgetPasswordController,
  getForgetOtpController,
  getUpdatePasswordController,
  forgetpasswordOtpVerify,
  sendForgetOtp,
  updatePasswordController,
  userLogoutController,
  getShopPage,
  getProductPage,
};
