const { Router } = require("express");

const apikey = require("./apikey.js");
const auth = require("./auth.js");
const external = require("./external.js");
const log = require("./log.js");
const page = require("./page.js");
const user = require("./user.js");

const v1 = Router();

v1.use("/apikey", apikey);
v1.use("/auth", auth);
v1.use("/external", external);
v1.use("/log", log);
v1.use("/page", page);
v1.use("/user", user);

module.exports = v1;
