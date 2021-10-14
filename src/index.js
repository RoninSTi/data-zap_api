import express from "express";

import "dotenv/config";

import cors from "cors";

import routes from "./routes/index.js";

import { sequelize } from "./models/index.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", routes.user);

app.get("/ping", (_, res) => {
  res.send("pong");
});

sequelize.sync().then(() => {
  app.listen(8000, "0.0.0.0", () =>
    console.log("Example app listening on port 8000!")
  );
});
