const { Router } = require("express");

const log = require("./external-log.js");

const external = Router();

external.use("/log", log);

module.exports = external;
