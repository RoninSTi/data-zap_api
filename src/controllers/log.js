const { models } = require("../models/index.js");
const AppError = require("../errors/app-error.js");

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

const create = async ({ data, userId }) => {
  const { tags, ...rest } = data;

  const user = await models.User.findByPk(userId);

  if (!user) throw new AppError("No user found", 404);

  const log = await models.Log.create(rest);

  await log.setUser(user);

  if (tags && tags.length > 0) {
    await associateTags({ logId: log.id, tags });
  }

  const logResponse = await logResponse({ logId: log.id });

  const response = {
    message: "Log created",
    log: logResponse,
  };

  return response;
};

const getLog = async ({ logId }) => {
  const response = await logResponse({ logId });

  return response;
};

const list = async ({ userId, limit, offset }) => {
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
    logs: logs,
  };

  return response;
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

  const logResponse = await logResponse({ logId });

  const response = {
    message: "Log updated",
    log: logResponse,
  };

  return response;
};

module.exports = {
  create,
  getLog,
  list,
  update,
};
