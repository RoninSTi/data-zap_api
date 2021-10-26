const jwt = require("jsonwebtoken");

const AppError = require("../errors/app-error");

const authenticateToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    throw new AppError("No token provided", 401);
  }

  jwt.verify(token, process.env.APP_SECRET, (err, user) => {
    if (err) {
      res.sendStatus(401);
    }

    req.user = user;

    next();
  });
};

module.exports = {
  authenticateToken,
};
