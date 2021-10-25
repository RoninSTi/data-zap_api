var crypto = require("crypto");
const { nanoid } = require("nanoid/async");

const { models } = require("../models/index.js");
const AppError = require("../errors/app-error.js");

const generate = async ({ userId, scopes }) => {
  const user = await models.User.findByPk(userId);

  if (!user) throw new AppError("User not found", 404);

  const prefix = Math.random().toString(36).substr(2, 5);

  const publickey = await nanoid();

  const privatekey = await nanoid();

  const apikey = await models.Apikey.create({
    prefix,
    privatekey,
    publickey,
    scopes,
  });

  const sharedkey = crypto
    .createHmac("sha256", process.env.APP_SECRET)
    .update(privatekey)
    .digest("base64");

  await apikey.setUser(user);

  const response = {
    apikey: `${prefix}.${publickey}.${sharedkey}`,
  };

  return response;
};

const list = async ({ userId }) => {
  const apikeys = await models.Apikey.findAll({
    where: {
      userId,
    },
    attributes: [
      "id",
      "prefix",
      "scopes",
      "isActive",
      "createdAt",
      "updatedAt",
    ],
  });

  const response = {
    message: "Apikeys fetched successfully",
    apikeys,
  };

  return response;
};

const update = async ({ apikeyId, data, userId }) => {
  const apikey = await models.Apikey.findByPk(apikeyId);

  if (!apikey) throw new AppError("Apikey not found", 404);

  if (userId !== apikey.userId)
    throw new AppError("User not provisioned for apikey", 401);

  await apikey.update(data);

  const updatedKey = await Apikey.findOne({
    where: {
      id: apikeyId,
    },
    attributes: [
      "id",
      "prefix",
      "scopes",
      "isActive",
      "createdAt",
      "updatedAt",
    ],
  });

  const response = {
    message: "Apikey updated",
    apikey: updatedKey.toJSON(),
  };

  return response;
};

module.exports = {
  generate,
  list,
  update,
};
