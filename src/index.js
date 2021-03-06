require("dotenv/config");

const express = require("express");

const cors = require("cors");

const cookieParser = require("cookie-parser");

const routes = require("./routes/index.js");

const { sequelize } = require("./models/index.js");

const { validationErrorMiddleware } = require("./schemas/index.js");

const AppError = require("./errors/app-error.js");

const app = express();

app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);
app.use(cookieParser(process.env.APP_SECRET));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/v1", routes.v1);

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
