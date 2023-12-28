const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
  image: {
    type: String,
    requied: true,
  },
});

module.exports = mongoose.model("Banner", bannerSchema);
