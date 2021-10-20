const AppError = require("../errors/app-error.js");

const { Op } = require("Sequelize");

const bcrypt = require("bcrypt");

var jwt = require("jsonwebtoken");

const user = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  });

  User.associate = (models) => {
    User.hasMany(models.Log, { onDelete: "CASCADE" });
    User.hasMany(models.Apikey, { onDelete: "CASCADE" });
  };

  User.authenticate = async ({ email, password }) => {
    const user = await User.findOne({
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
        expiresIn: 86400,
      }
    );

    const response = {
      accessToken,
      message: "Login successful",
      user: user.response(),
    };

    return response;
  };

  User.createNew = async ({ email, password, username }) => {
    const users = await User.findAll({
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

    const user = await User.create({ email, password: hash, username });

    const response = {
      message: "User creation successful",
      user: user.response(),
    };

    return response;
  };

  User.getMe = async ({ id }) => {
    const user = await User.findByPk(id);

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

  User.getUser = async ({ id }) => {
    const user = await User.findByPk(id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const response = {
      message: "User found",
      user: user.response(),
    };

    return response;
  };

  User.updateUser = async ({ id, data }) => {
    const user = await User.findByPk(id);

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

  User.prototype.response = function () {
    const response = this.toJSON();
    delete response.password;

    return response;
  };

  return User;
};

module.exports = user;
