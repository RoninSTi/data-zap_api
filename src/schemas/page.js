const post = {
  type: "object",
  required: ["title"],
  properties: {
    isPublic: {
      type: "boolean",
    },
    logs: {
      type: "array",
      items: {
        type: "string",
        minLength: 1,
      },
    },
  },
};

const put = {
  type: "object",
  required: ["title"],
  properties: {
    isPublic: {
      type: "boolean",
    },
    logs: {
      type: "array",
      items: {
        type: "string",
        minLength: 1,
      },
    },
  },
};

module.exports = {
  post,
  put,
};
