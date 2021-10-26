const { models } = require("../models/index.js");
const AppError = require("../errors/app-error.js");

const PAGE_INCLUDE = [
  {
    model: models.Log,
    include: [
      {
        model: models.Tag,
        attributes: ["id", "name"],
        through: {
          attributes: [],
        },
      },
    ],
    through: {
      attributes: [],
    },
  },
];

const create = async ({ data, userId }) => {
  const { logs, ...rest } = data;

  const page = await models.Page.create(rest);

  const user = await models.User.findByPk(userId);

  await page.setUser(user);

  await page.setLogs(logs);

  const pageResponse = await models.Page.findOne({
    where: {
      id: page.id,
    },
    include: PAGE_INCLUDE,
  });

  const response = {
    message: "Page created",
    page: pageResponse.toJSON(),
  };

  return response;
};

const get = async ({ pageId }) => {
  const page = await models.Page.findOne({
    where: {
      id: pageId,
    },
    include: PAGE_INCLUDE,
  });

  if (!page) throw new AppError("Page not found", 404);

  const response = {
    message: "Page fetched",
    page: page.toJSON(),
  };

  return response;
};

const list = async ({ userId }) => {
  const user = await models.User.findByPk(userId);

  const pages = await user.getPages({
    include: PAGE_INCLUDE,
  });

  const response = {
    message: "Pages fetched successfully",
    pages,
  };

  return response;
};

const update = async ({ pageId, data }) => {
  const { logs, ...rest } = data;

  const page = await models.Page.findByPk(pageId);

  await page.update(rest);

  await models.PageLog.destroy({
    where: {
      pageId,
    },
  });

  await page.setLogs(logs);

  const pageResponse = await models.Page.findOne({
    where: {
      id: page.id,
    },
    include: PAGE_INCLUDE,
  });

  const response = {
    message: "Page created",
    page: pageResponse.toJSON(),
  };

  return response;
};

module.exports = {
  create,
  get,
  list,
  update,
};
