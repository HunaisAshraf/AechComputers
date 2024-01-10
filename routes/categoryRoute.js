const express = require("express");
const router = express.Router();
const {
  getCategoryListpage,
  getAddCategorypage,
  AddCategoryController,
  deleteCategoryController,
  blockCategoryController,
  unblockCategoryController,
  getEditCategoryPage,
  editCategoryController,
  searchCategoryController,
  filterCategoryController,
} = require("../controllers/categoryController");
const { isAdmin } = require("../middlewares/adminMiddlewares");
const upload = require("../helpers/multer");

// router.get("/category-list", isAdmin, getCategoryListpage);

// router.get("/add-category", isAdmin, getAddCategorypage);

// router.post("/add-category", isAdmin, upload.any(), AddCategoryController);

// router.get("/delete-category/:id", isAdmin, deleteCategoryController);

// router.get("/block-category/:id", isAdmin, blockCategoryController);

// router.get("/unblock-category/:id", isAdmin, unblockCategoryController);

// router.get("/edit-category/:id", isAdmin, getEditCategoryPage);

// router.post("/edit-category", isAdmin, upload.any(), editCategoryController);

// router.post("/search-category", isAdmin, searchCategoryController);

// router.post("/filter-category", isAdmin, filterCategoryController);

module.exports = router;
