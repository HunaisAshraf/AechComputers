const UserModel = require("../models/adminModel");
const hashPassword = require("../helpers/helper");

const adminLoginController = async (req,res) => {
    res.render("adminPages/adminLogin")
};

module.exports = adminLoginController;
