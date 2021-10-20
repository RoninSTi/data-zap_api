const post = {
  type: "object",
  required: ["scopes"],
  properties: {
    scopes: {
      type: "string",
      minLength: 1,
    },
  },
};

const put = {
  type: "object",
  properties: {
    scopes: {
      type: "string",
      minLength: 1,
    },
    active: {
      enum: ["active", "inactive"],
    },
  },
  additionalProperties: false,
};

module.exports = {
  post,
  put,
};
