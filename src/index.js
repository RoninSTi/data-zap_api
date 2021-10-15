const express = require("express");

require("dotenv/config");

const cors = require("cors");

const routes = require("./routes/index.js");

const { sequelize } = require("./models/index.js");

const { validationErrorMiddleware } = require("./schemas/index.js");

const AppError = require("./errors/app-error.js");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", routes.user);

app.get("/ping", (_, res) => {
  res.send("pong");
});

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(validationErrorMiddleware);

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

sequelize.sync({ alter: true }).then(() => {
  app.listen(8000, "0.0.0.0", () =>
    console.log("DataZap API listening on port 8000!")
  );
});
