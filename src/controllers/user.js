const jwt = require("jsonwebtoken");

const { models } = require("../models/index.js");
const AppError = require("../errors/app-error.js");

const getMe = async ({ id }) => {
  const user = await models.User.findByPk(id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  var accessToken = jwt.sign(
    {
      id: user.id,
    },
    process.env.APP_SECRET,
    {
      expiresIn: 86400,
    }
  );

  const response = {
    accessToken,
    message: "Fetch me successful",
    user: user.response(),
  };

  return response;
};

const getUser = async ({ id }) => {
  const user = await models.User.findByPk(id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const response = {
    message: "User found",
    user: user.response(),
  };

  return response;
};

const updateUser = async ({ id, data }) => {
  const user = await models.User.findByPk(id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const { username, email, ...rest } = data;

  await user.update(rest);

  const response = {
    message: "User updated",
    user: user.response(),
  };

  return response;
};

module.exports = {
  getMe,
  getUser,
  updateUser,
};
