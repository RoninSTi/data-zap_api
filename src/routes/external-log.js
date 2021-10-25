const { Router } = require("express");
const asyncHandler = require("express-async-handler");

const { validateApikey } = require("../middleware/apikey.js");
const { log, validate } = require("../schemas/index.js");
const { create } = require("../controllers/log.js");

const router = Router();

router.post(
  "/",
  validateApikey({ scope: "log.create" }),
  validate({ body: log.post }),
  asyncHandler(async (req, res) => {
    const { userId, ...data } = req.body;

    const response = await create({ data, userId });

    res.send(response);
  })
);

module.exports = router;
