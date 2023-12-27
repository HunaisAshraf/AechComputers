const CategoryModel = require("../models/categoryModel");
const mongoose = require("mongoose");

const getCategoryListpage = async (req, res) => {
  try {
    let categories;
    if (req.session.category) {
      categories = req.session.category;
    } else {
      categories = await CategoryModel.find();
    }
    res.render("adminPages/categoryList", { categories });
    req.session.category = null;
    req.session.save();
  } catch (error) {
    console.log(error);
  }
};

const getAddCategorypage = async (req, res) => {
  try {
    res.render("adminpages/addCategory", {
      categoryExist: req.session.categoryExist,
      noValidInfo: req.session.noValidInfo,
    });
    req.session.noValidInfo = false;
    req.session.save();
  } catch (error) {
    console.log(error);
  }
};

const AddCategoryController = async (req, res) => {
  try {
    const { categoryName, description } = req.body;
    const image = req.files[0].filename;

    if (categoryName === "") {
      req.session.noValidInfo = true;
      res.redirect("/add-category");
    }
    if (description === "") {
      req.session.noValidInfo = true;
      res.redirect("/add-category");
    }

    const categories = await CategoryModel.findOne({ categoryName });

    if (categories) {
      req.session.categoryExist = true;
      res.redirect("/add-category");
    }

    const newCategory = await new CategoryModel({
      categoryName,
      description,
      image,
    }).save();
    res.redirect("/category-list");
  } catch (error) {
    console.log(error);
  }
};

const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await CategoryModel.findByIdAndDelete(id);
    res.redirect("/category-list");
  } catch (error) {
    console.log("error in deleting category ", error);
  }
};

const blockCategoryController = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await CategoryModel.findByIdAndUpdate(id, {
      isAvailable: false,
    });
    res.redirect("/category-list");
  } catch (error) {
    console.log(error);
  }
};
const unblockCategoryController = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await CategoryModel.findByIdAndUpdate(id, {
      isAvailable: true,
    });
    res.redirect("/category-list");
  } catch (error) {
    console.log(error);
  }
};

const getEditCategoryPage = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await CategoryModel.findOne({ _id: id });
    console.log(category);
    res.render("adminPages/editCategory", { category });
  } catch (error) {
    console.log("error in editing category ", error);
  }
};

const editCategoryController = async (req, res) => {
  try {
    const { categoryName, description, id } = req.body;
    const image = req.files[0].filename;
    const category = await CategoryModel.updateOne(
      { _id: id },
      { $set: { categoryName, description,image } }
    );
    res.redirect("category-list");
  } catch (error) {
    console.log("error in updating category ", error);
  }
};

const searchCategoryController = async (req, res) => {
  try {
    const { search } = req.body;
    const category = await CategoryModel.find({
      $or: [
        { categoryName: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ],
    });
    req.session.category = category;
    res.redirect("/category-list");
  } catch (error) {
    console.log(error);
  }
};

const filterCategoryController = async (req, res) => {
  try {
    const { filter } = req.body;
    let category;
    if (filter === "available") {
      category = await CategoryModel.find({ isAvailable: true });
    } else {
      category = await CategoryModel.find({ isAvailable: false });
    }
    req.session.category = category;
    res.redirect("/category-list");
    // res.render("adminPages/userList", { users });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
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
};
