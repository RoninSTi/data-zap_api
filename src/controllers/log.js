const { models, sequelize } = require("../models/index.js");
const AppError = require("../errors/app-error.js");
const { Op } = require("Sequelize");

const associateTags = async ({ logId, tags }) => {
  const log = await models.Log.findByPk(logId);

  const tagPromises = tags.map((tag) =>
    models.Tag.findOrCreate({
      where: { name: tag.toLowerCase().trim() },
    })
  );

  const tagObjects = await Promise.all(tagPromises);

  const tagsToAdd = tagObjects.map((tagObject) => tagObject[0]);

  return log.setTags(tagsToAdd);
};

const logResponse = async ({ logId }) => {
  const log = await models.Log.findOne({
    where: {
      id: logId,
    },
    include: [
      {
        model: models.Tag,
        attributes: ["id", "name"],
        through: {
          attributes: [],
        },
      },
    ],
  });

  return log.toJSON();
};

const create = async ({ data, userId }) => {
  const { tags, ...rest } = data;

  const user = await models.User.findByPk(userId);

  if (!user) throw new AppError("No user found", 404);

  const log = await models.Log.create(rest);

  await log.setUser(user);

  if (tags && tags.length > 0) {
    await associateTags({ logId: log.id, tags });
  }

  const logJSON = await logResponse({ logId: log.id });

  const response = {
    message: "Log created",
    log: logJSON,
  };

  return response;
};

const getLog = async ({ logId }) => {
  const response = await logResponse({ logId });

  return response;
};

const list = async ({ userId, limit, offset }) => {
  const count = await models.Log.count({
    where: {
      userId,
    },
  });

  const logs = await models.Log.findAll({
    where: {
      userId,
    },
    include: [
      {
        model: models.Tag,
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
    logs,
    count,
  };

  return response;
};

const recentlyViewed = async ({ userId, limit, offset }) => {
  const logs = await models.Log.findAll({
    where: {
      userId,
      viewedAt: {
        [Op.ne]: null,
      },
    },
    include: [
      {
        model: models.Tag,
        attributes: ["id", "name"],
        through: {
          attributes: [],
        },
      },
    ],
    order: [["viewedAt", "DESC"]],
    limit: 10,
  });

  const response = {
    message: "Recently viewed logs fetched",
    logs,
  };

  return response;
};

const update = async ({ logId, data }) => {
  const log = await models.Log.findByPk(logId);

  const { tags, ...rest } = data;

  await models.LogTag.destroy({
    where: {
      logId,
    },
  });

  if (tags && tags.length > 0) {
    await associateTags({ logId, tags });
  }

  await log.update(rest);

  const logJSON = await logResponse({ logId });

  const response = {
    message: "Log updated",
    log: logJSON,
  };

  return response;
};

const view = async ({ logId }) => {
  const log = await models.Log.findByPk(logId);

  await log.update({ viewedAt: sequelize.fn("NOW") });

  const logJSON = await logResponse({ logId });

  const response = {
    message: "Log viewed",
    log: logJSON,
  };

  return response;
};

module.exports = {
  create,
  getLog,
  list,
  recentlyViewed,
  update,
  view,
};
