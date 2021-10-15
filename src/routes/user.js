const { Router } = require("express");

const { user, validate } = require("../schemas/index.js");
const { models } = require("../models/index.js");

const router = Router();

router.post("/", validate({ body: user.post }), async (req, res, next) => {
  const { password, username } = req.body;

  try {
    const response = await models.User.createNew({ password, username });

    res.send(response);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
