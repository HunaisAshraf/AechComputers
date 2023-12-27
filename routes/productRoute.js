const express = require("express");
const { isAdmin } = require("../middlewares/adminMiddlewares");
const upload = require("../helpers/multer");
const {
  getAddProductPage,
  addProductController,
  getProductListPage,
  deleteProductController
} = require("../controllers/productController");

const router = express.Router();

router.get("/product-list",isAdmin,getProductListPage)
router.get("/add-product", isAdmin, getAddProductPage);
router.post("/add-product", isAdmin, upload.any(), addProductController);
router.get("/delete-product/:id", isAdmin, deleteProductController);

module.exports = router;
