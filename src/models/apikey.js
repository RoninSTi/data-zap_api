const AppError = require("../errors/app-error.js");

var crypto = require("crypto");

const { nanoid } = require("nanoid/async");

const apikey = (sequelize, DataTypes) => {
  const Apikey = sequelize.define("apikey", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
    },
    prefix: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    privatekey: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    publickey: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    scopes: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    active: {
      type: DataTypes.ENUM,
      defaultValue: "active",
      values: ["active", "inactive"],
    },
  });

  Apikey.associate = (models) => {
    Apikey.belongsTo(models.User);
  };

  Apikey.list = async ({ userId }) => {
    const apikeys = await Apikey.findAll({
      where: {
        userId,
      },
      attributes: [
        "id",
        "prefix",
        "scopes",
        "active",
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

  Apikey.generate = async ({ userId, scopes }) => {
    const user = await sequelize.models.user.findByPk(userId);

    if (!user) throw new AppError("User not found", 404);

    const prefix = Math.random().toString(36).substr(2, 5);

    const publickey = await nanoid();

    const privatekey = await nanoid();

    const apikey = await Apikey.create({
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

  Apikey.updateKey = async ({ apikeyId, data, userId }) => {
    const apikey = await Apikey.findByPk(apikeyId);

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
        "active",
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

  return Apikey;
};

module.exports = apikey;
