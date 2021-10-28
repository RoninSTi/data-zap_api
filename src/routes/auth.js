const { Router } = require("express");
const asyncHandler = require("express-async-handler");

const { auth, validate } = require("../schemas/index.js");

const {
  authenticate,
  forgot,
  register,
  reset,
} = require("../controllers/auth.js");

const { authenticateToken } = require("../middleware/auth.js");

const router = Router();

router.post(
  "/forgot",
  validate({ body: auth.postForgot }),
  asyncHandler(async (req, res) => {
    const { email } = req.body;

    const response = await forgot({ email });

    res.send(response);
  })
);

router.post(
  "/login",
  validate({ body: auth.postLogin }),
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const { accessToken, accessExpiration, ...response } = await authenticate({
      email,
      password,
    });

    return res
      .cookie("access_token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      })
      .cookie("access_expiration", accessExpiration, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
      })
      .status(200)
      .json(response);
  })
);

router.post("/logout", authenticateToken, (_, res) => {
  return res
    .clearCookie("access_token")
    .clearCookie("access_expiration")
    .status(200)
    .json({ message: "Successfully logged out" });
});

router.post(
  "/register",
  validate({ body: auth.postRegister }),
  asyncHandler(async (req, res) => {
    const { email, password, username } = req.body;

    const response = await register({
      email,
      password,
      username,
    });

    res.send(response);
  })
);

router.post(
  "/reset",
  validate({ body: auth.postReset }),
  asyncHandler(async (req, res) => {
    const { otp, password } = req.body;

    const response = await reset({ otp, password });

    res.send(response);
  })
);

module.exports = router;
