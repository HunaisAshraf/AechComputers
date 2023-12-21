const bcrypt = require("bcrypt");

const hashedPassword = async (password) => {
  try {
    const salt = 10;
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    console.log(error);
  }
};

const comparePassword = async (password, hash) => {
  try {
    const match = await bcrypt.compare(password, hash);
    return match;
  } catch (error) {
    console.log(`error while comparing password ${error}`);
  }
};

module.exports = { hashedPassword, comparePassword };
