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

    console.log(id);

    await ProductModel.updateOne(
      { _id: id },
      {
        $set: {
          productName,
          price,
          category,
          quantity,
          description,
        },
      }
    );

    if (req.files[0]) {
      await ProductModel.updateOne(
        { _id: id },
        {
          $set: { ["images.0"]: req.files[0].filename },
        }
      );
    }
    if (req.files[1]) {
      await ProductModel.updateOne(
        { _id: id },
        {
          $set: { ["images.1"]: req.files[1].filename },
        }
      );
    }
    if (req.files[2]) {
      await ProductModel.updateOne(
        { _id: id },
        {
          $set: { ["images.2"]: req.files[2].filename },
        }
      );
    }
    if (req.files[3]) {
      await ProductModel.updateOne(
        { _id: id },
        {
          $set: { ["images.3"]: req.files[3].filename },
        }
      );
    }

    res.redirect("/product-list");
  } catch (error) {
    console.log("error in updating image ", error);
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
