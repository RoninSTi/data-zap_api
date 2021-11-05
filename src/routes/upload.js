const { Router } = require("express");
const asyncHandler = require("express-async-handler");

const { authenticateToken } = require("../middleware/auth.js");
const { upload, validate } = require("../schemas/index.js");
const { getSignedUploadUrl } = require("../lib/aws");

const router = Router();

router.post(
  "/",
  authenticateToken,
  validate({ body: upload.post }),
  asyncHandler(async (req, res) => {
    const { id: userId } = req.user;
    const { fileName, fileType } = req.body;

    const response = await getSignedUploadUrl({ fileName, fileType, userId });

    res.send(response);
  })
);

module.exports = router;
