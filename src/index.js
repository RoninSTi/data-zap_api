import express from "express";

import "dotenv/config";

import cors from "cors";

import routes from "./routes/index.js";

import { sequelize } from "./models/index.js";

import AppError from "./errors/app-error.js";

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

app.use((err, _, res, _) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

// sequelize.sync().then(() => {
app.listen(8000, "0.0.0.0", () =>
  console.log("DataZap API listening on port 8000!")
);
// });
