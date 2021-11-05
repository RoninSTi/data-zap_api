const { nanoid } = require("nanoid/async");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require("Sequelize");

const { models } = require("../models/index.js");
const { sendTemplateEmail } = require("../lib/sg");
const AppError = require("../errors/app-error.js");

const authenticate = async ({ email, password }) => {
  const user = await models.User.findOne({
    where: {
      email,
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const passwordIsValid = bcrypt.compareSync(password, user.password);

  if (!passwordIsValid) {
    throw new AppError("Invalid password", 401);
  }

  var accessToken = jwt.sign(
    {
      id: user.id,
    },
    process.env.APP_SECRET,
    {
      expiresIn: 86400 * 1000,
    }
  );

  const response = {
    accessToken,
    accessExpiration: {
      expires: new Date(Date.now() + 86400 * 1000),
    },
    message: "Login successful",
    user: user.response(),
  };

  return response;
};

const forgot = async ({ email }) => {
  const user = await models.User.findOne({
    where: {
      email,
    },
  });

  if (!user) throw new AppError("User not found", 404);

  const otp = await nanoid();

  const userotp = await models.UserOtp.create({ otp });

  await userotp.setUser(user);

  sendTemplateEmail({
    to: email,
    templateId: "d-37f6eb8209f94a4e99349762bc7e77b6",
    dynamicTemplateData: {
      client_url: process.env.CLIENT_URL,
      otp,
    },
  });

  const response = {
    message: `An email has been sent with instructions to: ${email}`,
  };

  return response;
};

const register = async ({ email, password, username }) => {
  const users = await models.User.findAll({
    where: {
      [Op.or]: [
        {
          username,
        },
        {
          email,
        },
      ],
    },
  });

  if (users.length > 0) {
    throw new AppError(
      "A user already with that username and/or email exists",
      400
    );
  }

  const hash = bcrypt.hashSync(password, 10);

  const user = await models.User.create({ email, password: hash, username });

  const response = {
    message: "User creation successful",
    user: user.response(),
  };

  return response;
};

const reset = async ({ otp, password }) => {
  const userotp = await models.UserOtp.findOne({
    where: {
      otp,
    },
  });

  if (!userotp) throw new AppError("Reset record not found", 404);

  const user = await userotp.getUser();

  if (!user) throw new AppError("User not found", 404);

  const otpUpdatedAt = new Date(otp.updatedAt);

  const now = new Date();

  const isExpired = now - otpUpdatedAt > 15 * 60 * 1000;

  if (isExpired) throw new AppError("Reset expired", 401);

  const hash = bcrypt.hashSync(password, 10);

  await user.update({
    password: hash,
  });

  await userotp.destroy();

  const response = {
    message: `Password reset`,
    user: user.response(),
  };

  return response;
};

module.exports = {
  authenticate,
  forgot,
  register,
  reset,
};
