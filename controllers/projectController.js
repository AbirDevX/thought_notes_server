const { StatusCodes } = require("http-status-codes");
const { Validator } = require("node-input-validator");
const { HttpException } = require("../config/httpExaption");
const { toDestroyFile } = require("../utility/utility");
const { ProjectModel } = require("../models/projectModel");
const { UserModel } = require("../models/userModel");

const addProject = async (req, res) => {
  const payload = req?.body;
  const file = req?.file;
  const client = req?.client;
  try {
    payload["img"] = file;
    const rules = {
      title: "string|required",
      description: "string|required",
      img: "object|required",
    };
    const v = new Validator(payload, rules);
    const match = await v.check();
    if (!match) throw new HttpException(StatusCodes.BAD_REQUEST, v.errors);
    const newProject = new ProjectModel();
    newProject.title = payload?.title;
    newProject.description = payload?.description;
    newProject.img = file?.filename;
    newProject.userId = client?._id;
    await newProject.save();

    return res.status(StatusCodes.OK).json({ message: "OK" });
  } catch (error) {
    req?.file && toDestroyFile(`uploads/project/${file?.filename}`);
    const status = error?.status || StatusCodes.INTERNAL_SERVER_ERROR;
    const message = error?.message || "INTERNAL_SERVER_ERROR";
    return res.status(status).json({ errors: message });
  }
};
const allProject = async (req, res) => {
  const client = req?.client;
  try {
    const project = await ProjectModel.find({ userId: client?._id }).populate({
      path: "userId",
      select: { password: 0 },
    });
    return res.status(StatusCodes.OK).json({ message: "OK", project });
  } catch (error) {
    const status = error?.status || StatusCodes.INTERNAL_SERVER_ERROR;
    const message = error?.message || "INTERNAL_SERVER_ERROR..!";
    return res.status(status).json({ errors: message });
  }
};

module.exports = { addProject, allProject };
