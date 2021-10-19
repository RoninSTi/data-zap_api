const { Router } = require("express");

const user = require("./user.js");

const v1 = Router();

v1.use("/user", user);

module.exports = v1;
