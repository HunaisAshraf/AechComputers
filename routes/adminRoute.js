const express = require("express");
const router = express.Router();
const {
  adminLoginPageController,
  adminLoginController,
  getHomeController,
  adminLogoutController,
  userListController,
  blockUserController,
  unblockUserController,
  deleteUserController,
  searchUserController,
  filterUserController,
} = require("../controllers/adminController");
const { isAdmin } = require("../middlewares/adminMiddlewares");
const {
  getBannerPage,
  getAddBannerPage,
  addBannerController,
} = require("../controllers/bannerControl");
const upload = require("../helpers/multer");
const { getOrderList, orderStatusController, filterStatusContoller, searchOrderContoller, getOrderDetailsPage } = require("../controllers/adminOrderController");

router.get("/admin-login", adminLoginPageController);

router.post("/admin-login", adminLoginController);

router.get("/admin-dashboard", isAdmin, getHomeController);

router.get("/admin-logout", adminLogoutController);

router.get("/user-list", isAdmin, userListController);

router.get("/block-user/:id", isAdmin, blockUserController);

router.get("/unblock-user/:id", isAdmin, unblockUserController);

router.get("/delete-user/:id", isAdmin, deleteUserController);

router.post("/search-user", isAdmin, searchUserController);

router.post("/filter-user", isAdmin, filterUserController);

router.get("/banner-list", isAdmin, getBannerPage);

router.get("/add-banner", isAdmin, getAddBannerPage);

router.post("/add-banner", isAdmin, upload.any(), addBannerController);

//order list

router.get("/order-list", isAdmin, getOrderList);

router.post("/update-status", isAdmin, orderStatusController);
router.post("/filter-status", isAdmin, filterStatusContoller);
router.post("/search-orders", isAdmin, searchOrderContoller);
router.get("/order-details/:id" ,getOrderDetailsPage)


module.exports = router;

// router.get("/user-list", isAdmin, userListPageController);
// userListPageController,
