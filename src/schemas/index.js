const user = require("./user.js");

const {
  ValidationError,
  Validator,
} = require("express-json-validator-middleware");

const { validate } = new Validator();

const validationErrorMiddleware = (error, request, response, next) => {
  if (response.headersSent) {
    return next(error);
  }

  const isValidationError = error instanceof ValidationError;
  if (!isValidationError) {
    return next(error);
  }

  response.status(400).json({
    errors: error.validationErrors,
  });

  next();
};

module.exports = { user, validate, validationErrorMiddleware };
