const getHomeController = async (req, res) => {
  res.send("home");
};

const getUserLoginController = (req, res) => {
  res.render("userPages/userLogin", { signIn: req.session.signIn });
};
const getUserSignupController = (req, res) => {
  res.render("userPages/userSignUp", { signIn: req.session.signIn });
};

const userSignupController = async (req, res) => {};

const otpVerifyPage = (req,res)=>{
  res.render("userPages/otpVerify",{ signIn: req.session.signIn })
}

module.exports = {
  getUserLoginController,
  getUserLoginController,
  userSignupController,
  getUserSignupController,
  otpVerifyPage
};
