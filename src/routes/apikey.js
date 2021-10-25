const { Router } = require("express");
const asyncHandler = require("express-async-handler");

const { authenticateToken } = require("../middleware/auth.js");
const { apikey, validate } = require("../schemas/index.js");
const { generate, list, update } = require("../controllers/apikey.js");

const router = Router();

router.get(
  "/",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { id } = req.user;

    const response = await list({ userId: id });

    res.send(response);
  })
);

router.post(
  "/",
  authenticateToken,
  validate({ body: apikey.post }),
  asyncHandler(async (req, res) => {
    const { id } = req.user;
    const { scopes } = req.body;

    const response = await generate({ userId: id, scopes });

    res.send(response);
  })
);

router.put(
  "/:apikeyId",
  authenticateToken,
  validate({ body: apikey.put }),
  asyncHandler(async (req, res) => {
    const { apikeyId } = req.params;
    const data = req.body;
    const { id: userId } = req.user;

    const response = await update({
      apikeyId,
      data,
      userId,
    });

    res.send(response);
  })
);

module.exports = router;
