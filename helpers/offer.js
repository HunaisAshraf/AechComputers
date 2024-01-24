const ProductModel = require("../models/productModel");
const ProductOfferModel = require("../models/productOfferModel");

const applyProductOffer = async () => {
  try {
    const today = new Date();

    const offers = await ProductOfferModel.find().populate("product");

    offers.forEach(async (offer) => {
      if (offer.startDate <= today && offer.endDate >= today && offer.isAvailable) {
        await ProductModel.findByIdAndUpdate(offer.product, {
          offerPrice: Math.floor(offer.product.price - ( offer.product.price * offer.offerPercentage) / 100),
        });
      } else {
        await ProductModel.findByIdAndUpdate(offer.product, {
          offerPrice: offer.product.price,
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { applyProductOffer };
