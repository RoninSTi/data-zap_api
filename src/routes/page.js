const { Router } = require("express");
const asyncHandler = require("express-async-handler");

const { authenticateToken } = require("../middleware/auth.js");
const { page, validate } = require("../schemas/index.js");
const { create, get, list, update } = require("../controllers/page.js");

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

router.get(
  "/:pageId",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { pageId } = req.params;

    const response = await get({ pageId });

    res.send(response);
  })
);

router.post(
  "/",
  authenticateToken,
  validate({ body: page.post }),
  asyncHandler(async (req, res) => {
    const { id: userId } = req.user;
    const data = req.body;

    const response = await create({ data, userId });

    res.send(response);
  })
);

router.put(
  "/:pageId",
  authenticateToken,
  validate({ body: page.put }),
  asyncHandler(async (req, res) => {
    const { pageId } = req.params;
    const data = req.body;

    const response = await update({
      pageId,
      data,
    });

    res.send(response);
  })
);

module.exports = router;
