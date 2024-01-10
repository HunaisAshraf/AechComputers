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
const {
  getOrderList,
  orderStatusController,
  filterStatusContoller,
  searchOrderContoller,
  getOrderDetailsPage,
  getAdminOrderDetailsPage,
} = require("../controllers/adminOrderController");
const {
  getProductListPage,
  getAddProductPage,
  addProductController,
  deleteProductController,
  getProductEditpage,
  editProductController,
  filterProductController,
  blockProductController,
  unblockProductController,
  searchproductController,
} = require("../controllers/productController");
const { getCategoryListpage, getAddCategorypage, AddCategoryController, deleteCategoryController, blockCategoryController, unblockCategoryController, getEditCategoryPage, editCategoryController, searchCategoryController, filterCategoryController } = require("../controllers/categoryController");


//admin login
router.get("/admin-login", adminLoginPageController);
router.post("/admin-login", adminLoginController);
router.get("/admin-dashboard", isAdmin, getHomeController);
router.get("/admin-logout", adminLogoutController);

//user list
router.get("/user-list", isAdmin, userListController);
router.get("/block-user/:id", isAdmin, blockUserController);
router.get("/unblock-user/:id", isAdmin, unblockUserController);
router.get("/delete-user/:id", isAdmin, deleteUserController);
router.post("/search-user", isAdmin, searchUserController);
router.post("/filter-user", isAdmin, filterUserController);

//banner list
router.get("/banner-list", isAdmin, getBannerPage);
router.get("/add-banner", isAdmin, getAddBannerPage);
router.post("/add-banner", isAdmin, upload.any(), addBannerController);

// product list

router.get("/product-list", isAdmin, getProductListPage);
router.get("/add-product", isAdmin, getAddProductPage);
router.post("/add-product", isAdmin, upload.any(), addProductController);
router.get("/delete-product/:id", isAdmin, deleteProductController);
router.get("/edit-product/:id", isAdmin, getProductEditpage);
router.post("/edit-product", isAdmin, upload.any(), editProductController);
router.post("/filter-product", isAdmin, filterProductController);
router.get("/block-product/:id", isAdmin, blockProductController);
router.get("/unblock-product/:id", isAdmin, unblockProductController);
router.post("/search-product", isAdmin, searchproductController);

//order list

router.get("/order-list", isAdmin, getOrderList);
router.post("/update-status", isAdmin, orderStatusController);
router.post("/filter-status", isAdmin, filterStatusContoller);
router.post("/search-orders", isAdmin, searchOrderContoller);
router.get("/order-details/:id", getAdminOrderDetailsPage);


//category list

router.get("/category-list", isAdmin, getCategoryListpage);
router.get("/add-category", isAdmin, getAddCategorypage);
router.post("/add-category", isAdmin, upload.any(), AddCategoryController);
router.get("/delete-category/:id", isAdmin, deleteCategoryController);
router.get("/block-category/:id", isAdmin, blockCategoryController);
router.get("/unblock-category/:id", isAdmin, unblockCategoryController);
router.get("/edit-category/:id", isAdmin, getEditCategoryPage);
router.post("/edit-category", isAdmin, upload.any(), editCategoryController);
router.post("/search-category", isAdmin, searchCategoryController);
router.post("/filter-category", isAdmin, filterCategoryController);

module.exports = router;

// router.get("/user-list", isAdmin, userListPageController);
// userListPageController,
