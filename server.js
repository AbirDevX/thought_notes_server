const express = require("express");
const dotEnv = require("dotenv");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { join } = require("path");
const { dbConnection } = require("./config/dbConfig");
const { routes } = require("./routes/router");
const { notFoundHandler , defaultErrorHandler } = require("./middleware/common/errorHandler");
const cors = require("cors");

const app = express();

dotEnv.config({path:"./.dev.env"});
//THIRD PARTY MIDDLEWARE
app.use(cors({ origin: ["http://localhost:5173", "http://localhost:3000"], credentials: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// PUBLIC ROUTE
app.use(express.static(join(__dirname, "/public/")));
app.use(express.static(join(__dirname, "/uploads/")));
// DB CONNECTION
dbConnection();
// ROUTE
app.use("/api", routes);
// NOT FOUND HANDLER
app.use(notFoundHandler);
// ERROR HANDLER
app.use(defaultErrorHandler);

// LISTENING SERVER
app.listen(process.env.PORT, () =>
  console.log(`YOUR SERVER STARED ON: http://localhost:${process.env.PORT}/`)
);
