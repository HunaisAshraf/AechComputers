const express = require("express");
const adminLoginController = require("../controllers/adminController");

const router = express.Router()

router.get("/admin-login",adminLoginController)

module.exports = router;