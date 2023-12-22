const express = require("express");
const router = express.Router();
const {
  adminLoginPageController,
  adminLoginController,
  getHomeController
} = require("../controllers/adminController");
const { isAdmin } = require("../middlewares/adminMiddlewares");

router.get("/admin-login", adminLoginPageController);

router.post("/admin-login", adminLoginController);

router.get("/admin-dashboard",isAdmin,getHomeController)

module.exports = router;
