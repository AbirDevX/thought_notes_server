const express = require("express");
const {
  signIn,
  signUp,
  verifyClient,
} = require("../controllers/authController");
const { isAuthorized } = require("../middleware/auth/isAuthorized");
const { isAdmin } = require("../middleware/auth/isAdmin");
const { upload } = require("../utility/uploads");
const { addProject, allProject } = require("../controllers/projectController");
const { allClients } = require("../controllers/adminController");

const routes = express.Router();

routes.get("/", (req, res) => res.status(200).json({ msg: "ok" }));
routes.post("/sign-in", signIn);
routes.post("/sign-up", signUp);
routes.get("/verify-user", isAuthorized, verifyClient);
routes.post("/add-project", upload.single("img"), isAuthorized, addProject);
routes.get("/projects", isAuthorized, allProject);
routes.get("/all-clients", isAdmin, allClients);

module.exports = { routes };
