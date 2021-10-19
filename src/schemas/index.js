const user = require("./user.js");

const {
  ValidationError,
  Validator,
} = require("express-json-validator-middleware");

const { validate } = new Validator();

const validationErrorMiddleware = (err, _, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  const isValidationError = err instanceof ValidationError;

  if (!isValidationError) {
    return next(err);
  }

  res.status(400).json({
    errors: error.validationErrors,
  });

  next();
};

module.exports = { user, validate, validationErrorMiddleware };
