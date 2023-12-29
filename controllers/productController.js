const CategoryModel = require("../models/categoryModel");
const ProductModel = require("../models/productModel");

const getProductListPage = async (req, res) => {
  try {
    let products;
    if (req.session.product) {
      products = req.session.product;
    } else {
      products = await ProductModel.find().populate("category");
    }

    res.render("adminPages/productList", { products });
    req.session.product = null;
    req.session.save();
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

const filterProductController = async (req, res) => {
  try {
    const { filter } = req.body;
    let products;
    if (filter === "available") {
      products = await ProductModel.find({ isListed: true });
    } else {
      products = await ProductModel.find({ isListed: false });
    }
    req.session.product = products;
    res.redirect("/product-list");
    // res.render("adminPages/userList", { users });
  } catch (error) {
    console.log(error);
  }
};

const blockProductController = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await ProductModel.findByIdAndUpdate(id, {
      isListed: false,
    });
    res.redirect("/product-list");
  } catch (error) {
    console.log(error);
  }
};
const unblockProductController = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await ProductModel.findByIdAndUpdate(id, {
      isListed: true,
    });
    res.redirect("/product-list");
  } catch (error) {
    console.log(error);
  }
};

const searchproductController = async (req, res) => {
  try {
    const { search } = req.body;
    const product = await ProductModel.find({
      $or: [
        { productName: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ],
    });
    req.session.product = product;
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
  filterProductController,
  blockProductController,
  unblockProductController,
  searchproductController,
};
