const { Router } = require("express");

const { user, validate } = require("../schemas/index.js");
const { authenticateToken } = require("../lib/auth-middleware.js");
const { models } = require("../models/index.js");

const router = Router();

router.get("/me", authenticateToken, async (req, res, next) => {
  const { id } = req.user;

  try {
    const response = await models.User.getMe({ id });

    res.send(response);
  } catch (err) {
    next(err);
  }
});

router.get("/:userId", authenticateToken, async (req, res, next) => {
  const { userId } = req.params;

  try {
    const response = await models.User.getUser({ id: userId });

    res.send(response);
  } catch (err) {
    next(err);
  }
});

router.put(
  "/",
  authenticateToken,
  validate({ body: user.put }),
  async (req, res, next) => {
    const data = req.body;
    const { id } = req.user;

    try {
      const response = await models.User.updateUser({ data, id });

      res.send(response);
    } catch (err) {
      next(err);
    }
  }
);

router.post("/", validate({ body: user.post }), async (req, res, next) => {
  const { email, password, username } = req.body;

  try {
    const response = await models.User.createNew({
      email,
      password,
      username,
    });

    res.send(response);
  } catch (err) {
    next(err);
  }
});

router.post(
  "/login",
  validate({ body: user.postLogin }),
  async (req, res, next) => {
    const { email, password } = req.body;
    try {
      const response = await models.User.authenticate({ email, password });

      res.send(response);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
