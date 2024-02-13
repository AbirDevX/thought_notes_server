const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const { HttpException } = require("../../config/httpExaption");

const isAdmin = async (req, res, next) => {
  try {
    const token = req?.headers?.authorization?.split(" ")[1];
    if (!token)
      throw new HttpException(StatusCodes.BAD_REQUEST, "TOKEN_NOT_PROVIDE..!");

    jwt.verify(token, process.env.ADMIN_SECRET, (err, decoded) => {
      if (err)
        throw new HttpException(
          StatusCodes.UNAUTHORIZED,
          err?.message || "UNAUTHORIZED..!"
        );
      req.admin = decoded;
    });
    next();
  } catch (error) {
    console.log(error?.message);
    const message = error?.message || "INTERNAL_SERVER_ERROR..!";
    const status = error?.status || StatusCodes.INTERNAL_SERVER_ERROR;
    return res.status(status).json({ errors: { message } });
  }
};
module.exports = { isAdmin };
