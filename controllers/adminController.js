const { StatusCodes } = require("http-status-codes");
const { ROLE } = require("../config/enum");
const { UserModel } = require("../models/userModel");

const allClients = async (req, res) => {
  try {
    const clients = await UserModel.find({ role: ROLE.USER }, { password: 0 });
    return res.status(StatusCodes.OK).json({ message: "OK", clients });
  } catch (error) {
    const status = error?.status || StatusCodes.INTERNAL_SERVER_ERROR;
    const message = error?.message || "INTERNAL_SERVER_ERROR..!";
    return res.status(status).json({ errors: message });
  }
};

module.exports = { allClients };
