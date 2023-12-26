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

module.exports = router;

// router.get("/user-list", isAdmin, userListPageController);
// userListPageController,
