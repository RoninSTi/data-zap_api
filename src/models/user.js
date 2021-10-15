const AppError = require("../errors/app-error.js");

const bcrypt = require("bcrypt");

const user = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  User.createNew = async ({ password, username }) => {
    const users = await User.findAll({
      where: {
        username,
      },
    });

    if (users.length > 0) {
      throw new AppError("User already exists", 400);
    }

    const hash = bcrypt.hashSync(password, 10);

    const user = await User.create({ username, password: hash });

    return { user: user.response() };
  };

  User.associate = (models) => {
    User.hasMany(models.Log, { onDelete: "CASCADE" });
  };

  User.prototype.response = function () {
    const response = this.toJSON();
    delete response.password;

    return response;
  };

  return User;
};

module.exports = user;
