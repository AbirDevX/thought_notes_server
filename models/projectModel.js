const { mongo } = require("mongoose");
const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    img: {
      type: String,
      required: true,
      get: (img) => `${process.env.SERVER_URL}/project/${img}`,
    },
    userId: { type: mongoose.Schema.ObjectId, required: true, ref: "User" },
  },
  { timestamps: true, toJSON: { getters: true } }
);
const ProjectModel = mongoose.model("Project", ProjectSchema);
module.exports = { ProjectModel };
