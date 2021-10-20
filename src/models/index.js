const Sequelize = require("sequelize");

const apikeyModel = require("./apikey.js");
const logModel = require("./log.js");
const userModel = require("./user.js");

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
  Apikey: apikeyModel(sequelize, Sequelize.DataTypes),
  User: userModel(sequelize, Sequelize.DataTypes),
  Log: logModel(sequelize, Sequelize.DataTypes),
};

Object.keys(models).forEach((key) => {
  if ("associate" in models[key]) {
    models[key].associate(models);
  }
});

module.exports = { sequelize, models };
