const Sequelize = require("sequelize");

const apikeyModel = require("./apikey.js");
const logModel = require("./log.js");
const logtagModel = require("./logtag.js");
const pageModel = require("./page.js");
const pagelogModel = require("./pagelog.js");
const tagModel = require("./tag.js");
const userModel = require("./user.js");
const userotpModel = require("./userotp.js");

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
  Tag: tagModel(sequelize, Sequelize.DataTypes),
  Log: logModel(sequelize, Sequelize.DataTypes),
  LogTag: logtagModel(sequelize, Sequelize.DataTypes),
  Page: pageModel(sequelize, Sequelize.DataTypes),
  PageLog: pagelogModel(sequelize, Sequelize.DataTypes),
  UserOtp: userotpModel(sequelize, Sequelize.DataTypes),
};

Object.keys(models).forEach((key) => {
  if ("associate" in models[key]) {
    models[key].associate(models);
  }
});

module.exports = { sequelize, models };
