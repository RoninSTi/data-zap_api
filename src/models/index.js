import Sequelize from "sequelize";

import logModel from "./log.js";
import userModel from "./user.js";

const sequelize = new Sequelize(
  process.env.POSTGRES_DB,
  process.env.POSTGRES_USER,
  process.env.POSTGRES_PASSWORD,
  {
    host: "db",
    dialect: "postgres",
  }
);

const models = {
  User: userModel(sequelize, Sequelize.DataTypes),
  Log: logModel(sequelize, Sequelize.DataTypes),
};

Object.keys(models).forEach((key) => {
  if ("associate" in models[key]) {
    models[key].associate(models);
  }
});

export { sequelize };

export default models;
