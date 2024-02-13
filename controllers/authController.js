const { StatusCodes } = require("http-status-codes");
const niv = require("node-input-validator");
const { HttpException } = require("../config/httpExaption");
const { UserModel } = require("../models/userModel");
const { generateHash, compareHash } = require("../services/hash.service");
const { generateToken } = require("../services/token.service");
const { UserDto } = require("../dto/userDto");
const mongoose = require("mongoose");
const { json } = require("body-parser");
const { ROLE } = require("../config/enum");

const signUp = async (req, res) => {
  const payload = req?.body;
  try {
    const validationRules = {
      name: "required|string|minLength:3",
      email: "required|email|unique:User,email",
      mobile: "required|string|validNo|uniqueNo:User,mobile",
      password: "required|string|minLength:6",
    };

    const validationMessages = {
      en: {
        validNo: "Invalid mobile No..!",
        uniqueNo: "Mobile number already exist..!",
      },
    };
    // Extend validations and messages only once
    niv.extend("unique", async ({ value, args }) => {
      const field = args[1] || "email";

      let condition = {};

      condition[field] = value;

      let emailExist = await mongoose.model(args[0]).findOne(condition);

      // email already exists
      if (emailExist) {
        return false;
      }
      return true;
    });
    niv.extendMessages(validationMessages.en, "en");
    niv.extend("validNo", async ({ value }) => {
      if (!/^(\+\d{1,3}[- ]?)?\d{10}$/.test(value)) {
        return false;
      }
      return true;
    });
    niv.extend("uniqueNo", async ({ value, args }) => {
      const field = args[1] || "mobile";

      let condition = {};

      condition[field] = value;

      let mobileNOExist = await mongoose.model(args[0]).findOne(condition);

      // email already exists
      if (mobileNOExist) {
        return false;
      }
      return true;
    });

    const v = new niv.Validator(payload, validationRules);
    const match = await v.check();
    if (!match) throw new HttpException(StatusCodes.BAD_REQUEST, v.errors);

    const hashPw = await generateHash(payload.password);
    const newUser = new UserModel({ ...payload, password: hashPw });
    await newUser.save();
    const message = "Your Sign Up SUCCESS";
    return res.status(StatusCodes.CREATED).json({ message });
  } catch (error) {
    const status = error?.status || StatusCodes.INTERNAL_SERVER_ERROR;
    const message = error?.message || "INTERNAL_SERVER_ERROR";
    return res.status(status).json({ errors: { message } });
  }
};

const signIn = async (req, res) => {
  const payload = req?.body;

  try {
    const rules = {
      userName: "string|required",
      password: "string|required",
    };
    const v = new niv.Validator(payload, rules);
    const match = await v.check();
    if (!match) throw new HttpException(StatusCodes.BAD_REQUEST, v.errors);
    const user = await UserModel.findOne({
      $or: [{ email: payload.userName }, { mobile: payload.userName }],
    });
    if (!user) throw new HttpException(StatusCodes.BAD_REQUEST, "Not Found..!");
    const isValidPw = await compareHash(payload.password, user.password);
    if (!isValidPw)
      throw new HttpException(StatusCodes.UNAUTHORIZED, "UNAUTHORIZED..!");
    const tokenPayload = {
      _id: user._id,
      role: user.role,
      createdAT: user.createdAt,
      updatedAt: user.updatedAt,
    };
    const accessToken = await generateToken(
      tokenPayload,
      user.role === ROLE.ADMIN
        ? process.env.ADMIN_SECRET
        : process.env.USER_SECRET
    );
    return res
      .status(StatusCodes.OK)
      .json({ message: "OK", accessToken, client: new UserDto(user) });
  } catch (error) {
    console.log(error);
    const status = error?.status || StatusCodes.INTERNAL_SERVER_ERROR;
    const message = error?.message || "INTERNAL_SERVER_ERROR";
    return res.status(status).json({ errors: { message } });
  }
};
const verifyClient = async (req, res) => {
  const token = req?.headers?.authorization?.split(" ")[1];
  try {
    const user = req?.user;
    const admin = req?.admin;
    const client = await UserModel.findById(user?._id || admin?._id);
    return res
      .status(StatusCodes.OK)
      .json({ message: "OK", client: new UserDto(client), accessToken: token });
  } catch (error) {
    console.log(error);
    const message = error?.message || "INTERNAL_SERVER_ERROR..!";
    const status = error?.status || StatusCodes.INTERNAL_SERVER_ERROR;
    return res.status(status).json({ errors: { message } });
  }
};

module.exports = { signIn, signUp, verifyClient };
