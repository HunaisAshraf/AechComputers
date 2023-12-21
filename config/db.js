const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    let conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`successfully connected to DataBase`);
  } catch (error) {
    console.log(`error in mongoDB connection ${error}`);
  }
};

module.exports = connectDB;
