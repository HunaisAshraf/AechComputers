const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
  transcation: [
    // {
    //   date: {
    //     type: Date,
    //     default: new Date(),
    //   },
    //   message: {
    //     type: String,
    //     required: true,
    //   },
    //   amount: {
    //     type: Number,
    //     required: true,
    //   },
    // },
  ],
});

module.exports = mongoose.model("Wallet", walletSchema);
