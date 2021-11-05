const { Router } = require("express");
const asyncHandler = require("express-async-handler");

const { authenticateToken } = require("../middleware/auth.js");
const { log, validate } = require("../schemas/index.js");

const {
  create,
  getLog,
  list,
  recentlyViewed,
  update,
  view,
} = require("../controllers/log");

const router = Router();

router.get(
  "/",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { id: userId } = req.user;
    const { page: qPage = 0, pageSize: qPageSize = 100 } = req.query;

    const page = parseInt(qPage, 10);
    const pageSize = parseInt(qPageSize, 10);

    const offset = (page + 1) * pageSize - pageSize;

    const limit = pageSize;

    const response = await list({ offset, limit, userId });

    res.send(response);
  })
);

router.get(
  "/recently-viewed",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { id: userId } = req.user;

    const response = await recentlyViewed({ userId });

    res.send(response);
  })
);

router.get(
  "/:logId",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { logId } = req.params;

    const response = await getLog({ logId });

    res.send(response);
  })
);

router.post(
  "/",
  authenticateToken,
  validate({ body: log.post }),
  asyncHandler(async (req, res) => {
    const data = req.body;
    const { id: userId } = req.user;

    const response = await create({ data, userId });

    res.send(response);
  })
);

router.put(
  "/:logId",
  authenticateToken,
  validate({ body: log.put }),
  asyncHandler(async (req, res) => {
    const data = req.body;
    const { logId } = req.params;

    const response = await update({ logId, data });

    res.send(response);
  })
);

router.put(
  "/:logId/view",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { logId } = req.params;

    const response = await view({ logId });

    res.send(response);
  })
);

module.exports = router;
