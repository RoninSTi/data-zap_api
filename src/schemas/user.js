const post = {
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

const put = {
  type: "object",
  properties: {
    firstName: {
      type: "string",
      minLength: 1,
    },
    lastName: {
      type: "string",
      minLength: 1,
    },
  },
};

module.exports = {
  post,
  postLogin,
  put,
};
