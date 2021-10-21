const { Router } = require("express");

const { validateApikey } = require("../lib/apikey-middleware.js");
const { log, validate } = require("../schemas/index.js");

const { models } = require("../models/index.js");

const router = Router();

router.post(
  "/",
  validateApikey({ scope: "log.create" }),
  validate({ body: log.post }),
  async (req, res, next) => {
    const { userId, ...data } = req.body;

    try {
      const response = await models.Log.createNew({ data, userId });

      res.send(response);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
