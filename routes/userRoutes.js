const express = require("express");
const { getHomeController } = require("../controllers/userController");
const addAdmin = require("../controllers/adminController");

const router = express.Router();

// router.get("/",addAdmin)

module.exports = router;
