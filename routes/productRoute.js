const express = require("express");
const { isAdmin } = require("../middlewares/adminMiddlewares");
const upload = require("../helpers/multer");
const {
  getAddProductPage,
  addProductController,
  getProductListPage,
  deleteProductController,
  getProductEditpage,
  editProductController,
  filterProductController,
  blockProductController,
  unblockProductController,
  searchproductController,
} = require("../controllers/productController");

const router = express.Router();

router.get("/product-list", isAdmin, getProductListPage);
router.get("/add-product", isAdmin, getAddProductPage);
router.post("/add-product", isAdmin, upload.any(), addProductController);
router.get("/delete-product/:id", isAdmin, deleteProductController);
router.get("/edit-product/:id", isAdmin, getProductEditpage);
router.post("/edit-product", isAdmin, upload.any(), editProductController);
router.post("/filter-product", isAdmin, filterProductController);
router.post("/filter-product", isAdmin, filterProductController);
router.get("/block-product/:id", isAdmin, blockProductController);
router.get("/unblock-product/:id", isAdmin, unblockProductController);
router.post("/search-product", isAdmin, searchproductController);

module.exports = router;
