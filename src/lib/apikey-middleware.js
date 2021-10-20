const AppError = require("../errors/app-error");

var crypto = require("crypto");

const { models } = require("../models/index.js");

const validateApikey =
  ({ scope }) =>
  async (req, res, next) => {
    const passedKey = req.headers["x-api-key"];

    const publickey = passedKey && passedKey.split(".")[1];
    const sharedkey = passedKey && passedKey.split(".")[2];

    if (!publickey || !sharedkey) throw new AppError("Invalid key format", 401);

    try {
      const apikey = await models.Apikey.findOne({
        where: {
          publickey,
        },
      });

      if (!apikey) throw new AppError("Apikey not found", 401);

      const serversharedkey = crypto
        .createHmac("sha256", process.env.APP_SECRET)
        .update(apikey.privatekey)
        .digest("base64");

      if (serversharedkey !== sharedkey)
        throw new AppError("Invalid Apikey", 401);

      const keyScopes = JSON.parse(apikey.scopes);

      const hasScopes = keyScopes.indexOf(scope) > -1;

      if (!hasScopes)
        throw new AppError("Apikey not provisioned for operation", 401);

      if (apikey.active === "active") {
        next();
      } else {
        throw new AppError("Apikey inactive", 401);
      }
    } catch (err) {
      next(err);
    }
  };

module.exports = {
  validateApikey,
};
