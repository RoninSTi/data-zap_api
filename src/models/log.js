const AppError = require("../errors/app-error");

const log = (sequelize, DataTypes) => {
  const Log = sequelize.define("log", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
    },
    csvUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    youtubeUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  Log.associate = (models) => {
    Log.belongsTo(models.User);
    Log.belongsToMany(models.Tag, { through: models.LogTag });
  };

  Log.associateTags = async ({ logId, tags }) => {
    const log = await Log.findByPk(logId);

    const tagPromises = tags.map((tag) =>
      sequelize.models.tag.findOrCreate({
        where: { name: tag.toLowerCase().trim() },
      })
    );

    const tagObjects = await Promise.all(tagPromises);

    const tagsToAdd = tagObjects.map((tagObject) => tagObject[0]);

    return log.setTags(tagsToAdd);
  };

  Log.createNew = async ({ data, userId }) => {
    const { tags, ...rest } = data;

    const user = await sequelize.models.user.findByPk(userId);

    if (!user) throw new AppError("No user found", 404);

    const log = await Log.create(rest);

    await log.setUser(user);

    if (tags && tags.length > 0) {
      await Log.associateTags({ logId: log.id, tags });
    }

    const logResponse = await Log.response({ logId: log.id });

    const response = {
      message: "Log created",
      log: logResponse,
    };

    return response;
  };

  Log.getList = async ({ userId, limit, offset }) => {
    const logs = await Log.findAll({
      where: {
        userId,
      },
      include: [
        {
          model: sequelize.models.tag,
          attributes: ["id", "name"],
          through: {
            attributes: [],
          },
        },
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    const response = {
      message: "Logs fetched",
      logs: logs,
    };

    return response;
  };

  Log.getLog = async ({ logId }) => {
    const response = await Log.response({ logId });

    return response;
  };

  Log.response = async ({ logId }) => {
    const log = await Log.findOne({
      where: {
        id: logId,
      },
      include: [
        {
          model: sequelize.models.tag,
          attributes: ["id", "name"],
          through: {
            attributes: [],
          },
        },
      ],
    });

    return log.toJSON();
  };

  Log.updateLog = async ({ logId, data }) => {
    const log = await Log.findByPk(logId);

    const { tags, ...rest } = data;

    await sequelize.models.logtag.destroy({
      where: {
        logId,
      },
    });

    if (tags && tags.length > 0) {
      await Log.associateTags({ logId, tags });
    }

    await log.update(rest);

    const logResponse = await Log.response({ logId });

    const response = {
      message: "Log updated",
      log: logResponse,
    };

    return response;
  };

  return Log;
};

module.exports = log;
