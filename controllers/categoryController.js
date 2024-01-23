const CategoryModel = require("../models/categoryModel");
const mongoose = require("mongoose");

const getCategoryListpage = async (req, res) => {
  try {
    let categories;
    let count;
    let page = Number(req.query.page) || 1;
    let limit = 3;
    let skip = (page - 1) * limit;
    if (req.session.category) {
      categories = req.session.category;
    } else {
      count = await CategoryModel.find().estimatedDocumentCount();
      categories = await CategoryModel.find().skip(skip).limit(limit);
    }
    res.render("adminPages/categoryList", { categories,count,limit });
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

    const categories = await CategoryModel.findOne({ categoryName });

    if (categories) {
      return res.status(500).send({ success: false, categoryExist: true });
    } else {
      const newCategory = await new CategoryModel({
        categoryName,
        description,
        image,
      }).save();

      return res.status(200).send({ success: true });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false });
  }
};

// const deleteCategoryController = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const user = await CategoryModel.findByIdAndDelete(id);
//     res.redirect("/category-list");
//   } catch (error) {
//     console.log("error in deleting category ", error);
//   }
// };

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

    res.render("adminPages/editCategory", { category });
  } catch (error) {
    console.log("error in editing category ", error);
  }
};

const editCategoryController = async (req, res) => {
  try {
    const { categoryName, description, id } = req.body;
    const image = req.files[0]?.filename;

    const findCat = await CategoryModel.findOne({ categoryName });

    if (!findCat || String(findCat._id) === id) {
      console.log("sdasfafs");
      const category = await CategoryModel.updateOne(
        { _id: id },
        { $set: { categoryName, description } }
      );
      if (image) {
        const category = await CategoryModel.updateOne(
          { _id: id },
          { $set: { image } }
        );
      }
      return res.status(200).send({ success: true });
    } else {
      return res.status(500).send({ success: false, categoryExist: true });
    }
  } catch (error) {
    console.log("error in updating category ", error);
    return res.status(500).send({ success: false });
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
  blockCategoryController,
  unblockCategoryController,
  getEditCategoryPage,
  editCategoryController,
  searchCategoryController,
  filterCategoryController,
};
