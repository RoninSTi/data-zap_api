const apikey = require("./apikey.js");
const auth = require("./auth.js");
const log = require("./log.js");
const page = require("./page.js");
const user = require("./user.js");

const {
  ValidationError,
  Validator,
} = require("express-json-validator-middleware");

const { validate } = new Validator();

const validationErrorMiddleware = (err, _, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const isValidationError = err instanceof ValidationError;

  if (!isValidationError) {
    return next(err);
  }

  res.status(400).json({
    errors: err.validationErrors,
  });

  next();
};

module.exports = {
  apikey,
  auth,
  log,
  page,
  user,
  validate,
  validationErrorMiddleware,
};
