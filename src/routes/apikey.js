const { Router } = require("express");
const { authenticateToken } = require("../lib/auth-middleware.js");
const { models } = require("../models/index.js");
const { apikey, validate } = require("../schemas/index.js");

const router = Router();

router.get("/", authenticateToken, async (req, res, next) => {
  const { id } = req.user;

  try {
    const response = await models.Apikey.list({ userId: id });

    res.send(response);
  } catch (err) {
    next(err);
  }
});

router.post(
  "/",
  authenticateToken,
  validate({ body: apikey.post }),
  async (req, res, next) => {
    const { id } = req.user;
    const { scopes } = req.body;

    try {
      const response = await models.Apikey.generate({ userId: id, scopes });

      res.send(response);
    } catch (err) {
      next(err);
    }
  }
);

router.put(
  "/:apikeyId",
  authenticateToken,
  validate({ body: apikey.put }),
  async (req, res, next) => {
    const { apikeyId } = req.params;
    const data = req.body;
    const { id: userId } = req.user;

    try {
      const response = await models.Apikey.updateKey({
        apikeyId,
        data,
        userId,
      });

      res.send(response);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
