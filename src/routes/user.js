const { Router } = require("express");
const asyncHandler = require("express-async-handler");

const { user, validate } = require("../schemas/index.js");
const { authenticateToken } = require("../middleware/auth.js");
const { getMe, getUser, updateUser } = require("../controllers/user.js");

const router = Router();

router.get(
  "/me",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { id } = req.user;

    const response = await getMe({ id });

    res.send(response);
  })
);

router.get(
  "/:userId",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const response = await getUser({ id: userId });

    res.send(response);
  })
);

router.put(
  "/",
  authenticateToken,
  validate({ body: user.put }),
  asyncHandler(async (req, res) => {
    const data = req.body;

    const { id } = req.user;

    const response = await updateUser({ data, id });

    res.send(response);
  })
);

module.exports = router;
