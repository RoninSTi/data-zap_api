const { Router } = require("express");

const { authenticateToken } = require("../lib/auth-middleware.js");
const { log, validate } = require("../schemas/index.js");

const { models } = require("../models/index.js");

const router = Router();

router.get("/", authenticateToken, async (req, res, next) => {
  const { id: userId } = req.user;
  const { page = 1, pageSize = 100 } = req.query;

  const offset = page * pageSize - pageSize;
  const limit = pageSize;

  try {
    const response = await models.Log.getList({ offset, limit, userId });

    res.send(response);
  } catch (err) {
    next(err);
  }
});

router.get("/:logId", authenticateToken, async (req, res, next) => {
  const { logId } = req.params;

  try {
    const response = await models.Log.getLog({ logId });

    res.send(response);
  } catch (err) {
    next(err);
  }
});

router.post(
  "/",
  authenticateToken,
  validate({ body: log.post }),
  async (req, res, next) => {
    const data = req.body;
    const { id: userId } = req.user;

    try {
      const response = await models.Log.createNew({ data, userId });

      res.send(response);
    } catch (err) {
      next(err);
    }
  }
);

router.put(
  "/:logId",
  authenticateToken,
  validate({ body: log.put }),
  async (req, res, next) => {
    const data = req.body;
    const { logId } = req.params;

    try {
      const response = await models.Log.updateLog({ logId, data });

      res.send(response);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
