const { StatusCodes } = require("http-status-codes");
const { MulterError } = require("multer");

const notFoundHandler = (req, res) => {
  return res
    .status(StatusCodes.NOT_FOUND)
    .json({ message: "Not Found...!", status: StatusCodes.NOT_FOUND });
};

const defaultErrorHandler = (error, req, res, next) => {
  if (error) {
    if (error instanceof MulterError) {
      console.log("....multer Error.....");
      console.log(error);
      return res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
    console.log(error?.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error.message);
  }
  next();
};

module.exports = { notFoundHandler, defaultErrorHandler };
