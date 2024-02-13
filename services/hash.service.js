const bcrypt = require("bcrypt");

const generateHash = async (plainTxt, salt = 10) => {
  return await bcrypt.hash(plainTxt, salt);
};
const compareHash = async (plainTxt, hashPW) => {
  return await bcrypt.compare(plainTxt, hashPW);
};
module.exports = { generateHash, compareHash };
