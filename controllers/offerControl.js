const { applyProductOffer, applyCategoryOffer } = require("../helpers/offer");
const categoryModel = require("../models/categoryModel");
const categoryOfferModel = require("../models/categoryOfferModel");
const ProductModel = require("../models/productModel");
const ProductOfferModel = require("../models/productOfferModel");

const getOfferPage = async (req, res) => {
  try {
    const offers = await ProductOfferModel.find().populate("product");
    const products = await ProductModel.find();
    await applyProductOffer();
    res.render("adminPages/productOfferList", { offers, products });
  } catch (error) {
    console.log(error);
  }
};

const addProductOfferController = async (req, res) => {
  try {
    const { product, offerPercentage, startDate, endDate } = req.body;

    const offerExist = await ProductOfferModel.findOne({ product });

    if (offerExist) {
      return res.status(500).send({ exist: true });
    }

    const offer = await new ProductOfferModel({
      product,
      offerPercentage,
      startDate,
      endDate,
    }).save();

    return res.status(200).send({ success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false });
  }
};

const editProductOffer = async (req, res) => {
  try {
    const { id, offerPercentage, startDate, endDate } = req.body;

    const offer = await ProductOfferModel.findByIdAndUpdate(id, {
      offerPercentage,
      startDate,
      endDate,
    });
    return res.status(200).send({ success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false });
  }
};

const editProductOfferStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const offer = await ProductOfferModel.findOne({ _id: id });
    if (offer.isAvailable) {
      await ProductOfferModel.findByIdAndUpdate(id, {
        isAvailable: false,
      });
    } else {
      await ProductOfferModel.findByIdAndUpdate(id, {
        isAvailable: true,
      });
    }
    res.redirect("/offer-list");
  } catch (error) {
    console.log(error);
  }
};

const getCategoryOffer = async (req, res) => {
  try {
    const categories = await categoryModel.find();
    const offers = await categoryOfferModel.find().populate("category");
    applyCategoryOffer();
    res.render("adminPages/categoryOfferList", { categories, offers });
  } catch (error) {
    console.log(error);
  }
};

const addCategoryOffer = async (req, res) => {
  try {
    const { category, offerPercentage, startDate, endDate } = req.body;

    const offerExist = await categoryOfferModel.findOne({ category });

    if (offerExist) {
      return res.status(500).send({ exist: true });
    }

    const offer = await new categoryOfferModel({
      category,
      offerPercentage,
      startDate,
      endDate,
    }).save();

    return res.status(200).send({ success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false });
  }
};

const editCategoryOffer = async (req, res) => {
  try {
    console.log(req.body);
    const { id, offerPercentage, startDate, endDate } = req.body;

    const offer = await categoryOfferModel.findByIdAndUpdate(id, {
      offerPercentage,
      startDate,
      endDate,
    });

    return res.status(200).send({ success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false });
  }
};

const editCategoryOfferStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const offer = await categoryOfferModel.findOne({ _id: id });
    if (offer.isAvailable) {
      await categoryOfferModel.findByIdAndUpdate(id, {
        isAvailable: false,
      });
    } else {
      await categoryOfferModel.findByIdAndUpdate(id, {
        isAvailable: true,
      });
    }
    res.redirect("/category-offer-list");
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getOfferPage,
  addProductOfferController,
  editProductOffer,
  editProductOfferStatus,
  getCategoryOffer,
  addCategoryOffer,
  editCategoryOffer,
  editCategoryOfferStatus,
};
