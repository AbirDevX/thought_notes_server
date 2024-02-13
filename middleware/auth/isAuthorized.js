const { ROLE } = require("../../config/enum");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const { HttpException } = require("../../config/httpExaption");

const isAuthorized = async (req, res, next) => {
  try {
    const token = req?.headers?.authorization?.split(" ")[1];
    if (!token)
      throw new HttpException(StatusCodes.BAD_REQUEST, "TOKEN_NOT_PROVIDE..!");
    const decodeToken = await jwt.decode(token);
    if (!decodeToken)
      throw new HttpException(StatusCodes.UNAUTHORIZED, "INVALID_TOKEN..!");
    if (decodeToken?.role === ROLE.USER) {
      jwt.verify(token, process.env.USER_SECRET, (err, decoded) => {
        if (err)
          throw new HttpException(StatusCodes.UNAUTHORIZED, "UNAUTHORIZED..!");
        req.user = decoded;
        req.client = decoded;
      });
    } else if (decodeToken?.role === ROLE.ADMIN) {
      jwt.verify(token, process.env.ADMIN_SECRET, (err, decoded) => {
        if (err)
          throw new HttpException(StatusCodes.UNAUTHORIZED, "UNAUTHORIZED..!");
        req.admin = decoded;
        req.client = decoded;
      });
    }
    next();
  } catch (error) {
    console.log(error?.message);
    const message = error?.message || "INTERNAL_SERVER_ERROR..!";
    const status = error?.status || StatusCodes.INTERNAL_SERVER_ERROR;
    return res.status(status).json({ errors: { message } });
  }
};
module.exports = { isAuthorized };
