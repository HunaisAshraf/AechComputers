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
const OrderModel = require("../models/orderModel");
const { AddressModel } = require("../models/addressModel");
const WalletModel = require("../models/walletModel");

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
    let allProducts;
    let count;
    let page = Number(req.query.page) || 1;
    // let limit = Number(req.query.limit);
    let limit = 3;
    let skip = (page - 1) * limit;

    if (req.session.products) {
      allProducts = req.session.products;
    } else {
      count = await ProductModel.find().estimatedDocumentCount();
      allProducts = await ProductModel.find()
        .skip(skip)
        .limit(limit)
        .populate("category");
    }

    let products = allProducts.filter((product) => {
      if (product.category.isAvailable && product.isListed) {
        return product;
      }
    });

    const categories = await CategoryModel.find({ isAvailable: true });
    res.render("userPages/shopPage", {
      signIn: req.session.signIn,
      products,
      categories,
      count,
      limit,
    });
    req.session.products = null;
    req.session.save();
  } catch (error) {
    console.log(error);
  }
};

const filterCategoryPage = async (req, res) => {
  try {
    const { id } = req.params;

    const products = await ProductModel.find({ category: id }).populate(
      "category"
    );

    req.session.products = products;
    res.redirect("/shop");
  } catch (error) {
    console.log(error);
  }
};

const searchUserProductController = async (req, res) => {
  try {
    const { search } = req.body;
    const products = await ProductModel.find({
      $or: [
        { productName: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ],
    }).populate("category");
    req.session.products = products;
    res.redirect("/shop");
  } catch (error) {
    console.log(error);
  }
};

const filterProductByCAtegory = async (req, res) => {
  try {
    const { id } = req.body;
    console.log(id);
    const products = await ProductModel.find({ category: id }).populate(
      "category"
    );
    req.session.products = products;
    res.redirect("/shop");
  } catch (error) {
    console.log(error);
  }
};

const filterProductByPrice = async (req, res) => {
  try {
    const price = Number(req.body.price);
    const products = await ProductModel.find({
      price: { $lte: price },
    }).populate("category");
    req.session.products = products;
    res.redirect("/shop");
  } catch (error) {
    console.log(error);
  }
};

const getProductPage = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await ProductModel.findOne({ _id: id });
    res.render("userPages/productPage", {
      signIn: req.session.signIn,
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

    req.session.user = user;
    req.session.signIn = true;
    // req.session.notBlocked = user.isBlocked;
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

    console.log(otp);

    const send = await otpSender(firstName, email, otp);

    res.redirect("/verify-otp");
  } catch (error) {
    console.log(error);
  }
};

const userSignupController = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, password, confirmPassword } =
      req.body;

    const user = await userModel.findOne({ email });
    console.log(user);

    const errMsg = {};
    req.session.inputErr = false;
    if (user) {
      errMsg["user"] = "User exist";
      req.session.inputErr = true;
    }
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
    // setTimeout(() => {
    //   req.session.otp = null;
    //   console.log("otp expired ", req.session.otp);
    // }, 1000 * 60);
    console.log("userpage ", req.session.otp);
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
    }
    // next();
    //   req.session.inValidOtp = true;
    //   res.redirect("/verify-otp");
    // }
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
    req.session.user = user;
    req.session.signIn = true;

    await new WalletModel({
      user: req.session.user._id,
    }).save();

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

const getUserProfileController = async (req, res) => {
  try {
    const wallet = await WalletModel.findOne({ user: req.session.user._id });
    res.render("userPages/userProfile", {
      signIn: req.session.signIn,
      user: req.session.user,
      wallet,
    });
  } catch (error) {
    console.log(error);
  }
};

const getUserAddressController = async (req, res) => {
  try {
    const address = await AddressModel.find({ user_id: req.session.user._id });
    res.render("userPages/userAddress", {
      signIn: req.session.signIn,
      address,
    });
  } catch (error) {
    console.log(error);
  }
};
const getUserOrdersController = async (req, res) => {
  try {
    const order = await OrderModel.find({
      user: req.session.user._id,
    }).populate("products");
    res.render("userPages/userOrders", { signIn: req.session.signIn, order });
  } catch (error) {
    console.log(error);
  }
};

const getUserOrdersDetailsController = async (req, res) => {
  try {
    const { id } = req.params;
    let order = await OrderModel.findOne({ _id: id }).populate("products");
    order = JSON.parse(JSON.stringify(order));
    res.render("userPages/orderDetails", { order, signIn: req.session.signIn });
  } catch (error) {
    console.log(error);
  }
};

const editUserinfoController = async (req, res) => {
  try {
    const { id, firstName, lastName, email, phone } = req.body;
    await userModel.findByIdAndUpdate(id, {
      firstName,
      lastName,
      email,
      phone,
    });
    const user = await userModel.findOne({ _id: req.session.user._id });

    req.session.user = user;
    res.status(200).send({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false });
  }
};

const editUserPasswordController = async (req, res) => {
  try {
    const { id, currentPassword, newPassword } = req.body;

    const passwordMatch = await comparePassword(
      currentPassword,
      req.session.user.password
    );

    if (!passwordMatch) {
      res.status(400).send({ success: false });
    } else {
      const hashedPassword = await hashPassword(newPassword);
      await userModel.findByIdAndUpdate(id, {
        password: hashedPassword,
      });
      res.status(200).send({ success: true });
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
  getUserProfileController,
  filterCategoryPage,
  filterProductByCAtegory,
  filterProductByPrice,
  editUserinfoController,
  getUserAddressController,
  getUserOrdersController,
  editUserPasswordController,
  searchUserProductController,
  getUserOrdersDetailsController,
};
