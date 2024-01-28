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
  getAdminDashboard,
  chartDataController,
  getSalesReport,
  downloadSalesReport,
  filterSalesReport,
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
const {
  getCategoryListpage,
  getAddCategorypage,
  AddCategoryController,
  blockCategoryController,
  unblockCategoryController,
  getEditCategoryPage,
  editCategoryController,
  searchCategoryController,
  filterCategoryController,
} = require("../controllers/categoryController");
const {
  getCouponPage,
  addCouponController,
  editCouponController,
  editCouponStatusController,
} = require("../controllers/couponController");
const {
  getOfferPage,
  addProductOfferController,
  editProductOffer,
  editProductOfferStatus,
  getCategoryOffer,
  addCategoryOffer,
  editCategoryOffer,
  editCategoryOfferStatus,
} = require("../controllers/offerControl");

//admin login
router.get("/admin-login", adminLoginPageController);
router.post("/admin-login", adminLoginController);
router.get("/admin-dashboard", isAdmin, getAdminDashboard);
router.get("/chart-data", isAdmin, chartDataController);
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
router.get("/block-category/:id", isAdmin, blockCategoryController);
router.get("/unblock-category/:id", isAdmin, unblockCategoryController);
router.get("/edit-category/:id", isAdmin, getEditCategoryPage);
router.post("/edit-category", isAdmin, upload.any(), editCategoryController);
router.post("/search-category", isAdmin, searchCategoryController);
router.post("/filter-category", isAdmin, filterCategoryController);

//coupon

router.get("/coupon-list", isAdmin, getCouponPage);
router.post("/add-coupon", isAdmin, addCouponController);
router.post("/edit-coupon", isAdmin, editCouponController);
router.patch("/coupon/change-status", isAdmin, editCouponStatusController);

//salesReport

router.get("/sales-report", isAdmin, getSalesReport);
router.get("/download-sales-report", isAdmin, downloadSalesReport);
router.post("/filter-sales-report", isAdmin, filterSalesReport);

//product offer list

router.get("/offer-list", isAdmin, getOfferPage);
router.post("/add-product-offer", isAdmin, addProductOfferController);
router.put("/edit-product-offer", isAdmin, editProductOffer);
router.get("/productoffer-status/:id", isAdmin, editProductOfferStatus);

//category offer list

router.get("/category-offer-list", isAdmin, getCategoryOffer);
router.post("/add-category-offer", isAdmin, addCategoryOffer);
router.put("/edit-category-offer", isAdmin, editCategoryOffer);
router.get("/categoryoffer-status/:id", isAdmin, editCategoryOfferStatus);

module.exports = router;

