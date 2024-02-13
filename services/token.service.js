const jwt = require("jsonwebtoken");

const generateToken = async (tokePayload, secret) => {
  return await jwt.sign(tokePayload, secret, { expiresIn: "1hr" });
};

module.exports = { generateToken };
