const CategoryModel = require("../models/categoryModel");
const ProductModel = require("../models/productModel");

const getProductListPage = async (req, res) => {
  try {
    const products = await ProductModel.find().populate("category");

    res.render("adminPages/productList", { products });
  } catch (error) {
    console.log("error in getting products in adminpanel ", error);
  }
};

const getAddProductPage = async (req, res) => {
  try {
    const categories = await CategoryModel.find();

    res.render("adminPages/addProduct", { categories });
  } catch (error) {
    console.log("error in add product page ", error);
  }
};

const addProductController = async (req, res) => {
  try {
    const { productName, price, category, quantity, description } = req.body;
    const images = req.files.map((m) => m.filename);

    const product = await new ProductModel({
      productName,
      price,
      category,
      quantity,
      description,
      images,
    }).save();
    console.log(product);
    res.redirect("/product-list");
  } catch (error) {
    console.log("error in adding product ", error);
  }
};

const deleteProductController = async (req, res) => {
  try {
    const { id } = req.params;
    const products = await ProductModel.findByIdAndDelete(id);
    res.redirect("/product-list");
  } catch (error) {
    console.log("error in deleting products", error);
  }
};

const getProductEditpage = async (req, res) => {
  try {
    const { id } = req.params;
    const categories = await CategoryModel.find();
    const product = await ProductModel.findOne({ _id: id }).populate(
      "category"
    );

    console.log(product);
    console.log(categories);

    res.render("adminPages/editProduct", { categories, product });
  } catch (error) {
    console.log(error);
  }
};

const editProductController = async (req, res) => {
  try {
    const { productName, price, category, quantity, description, id } =
      req.body;

    const images = req.files.map((m) => m.filename);

    await ProductModel.findOneAndUpdate(id, {
      $push: { images: { $each: images } },
    });

    await ProductModel.findOneAndUpdate(id, {
      productName,
      price,
      category,
      quantity,
      description,
    });
    res.redirect("/product-list");
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getProductListPage,
  getAddProductPage,
  addProductController,
  deleteProductController,
  getProductEditpage,
  editProductController,
};
