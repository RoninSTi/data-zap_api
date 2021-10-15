const post = {
  type: "object",
  required: ["username", "password"],
  properties: {
    username: {
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
  post,
};