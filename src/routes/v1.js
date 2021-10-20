const { Router } = require("express");

const apikey = require("./apikey.js");
const log = require("./log.js");
const user = require("./user.js");

const v1 = Router();

v1.use("/apikey", apikey);
v1.use("/log", log);
v1.use("/user", user);

module.exports = v1;
