const postForgot = {
  type: "object",
  required: ["email"],
  properties: {
    email: {
      format: "email",
      type: "string",
      minLength: 1,
    },
  },
};

const postLogin = {
  type: "object",
  required: ["email", "password"],
  properties: {
    email: {
      format: "email",
      type: "string",
      minLength: 1,
    },
    password: {
      type: "string",
      minLength: 1,
    },
  },
};

const postRegister = {
  type: "object",
  required: ["email", "password", "username"],
  properties: {
    email: {
      format: "email",
      type: "string",
      minLength: 1,
    },
    password: {
      type: "string",
      minLength: 1,
    },
    username: {
      type: "string",
      minLength: 1,
    },
  },
};

const postReset = {
  type: "object",
  required: ["otp", "password"],
  properties: {
    otp: {
      type: "string",
      minLength: 1,
    },
    password: {
      type: "string",
      minLength: 1,
    },
  },
};

module.exports = {
  postForgot,
  postLogin,
  postRegister,
  postReset,
};
