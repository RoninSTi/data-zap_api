const { Router } = require("express");

const { validateApikey } = require("../lib/apikey-middleware.js");

const router = Router();

router.post(
  "/",
  validateApikey({ scope: "log.create" }),
  async (req, res, next) => {
    res.send("OK");
  }
);

module.exports = router;
