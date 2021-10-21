const post = {
  type: "object",
  required: ["title", "csvUrl"],
  properties: {
    title: {
      type: "string",
      minLength: 1,
    },
    csvUrl: {
      format: "url",
      type: "string",
      minLength: 1,
    },
    tags: {
      type: "array",
      items: {
        type: "string",
        minLength: 1,
      },
    },
    youtubeUrl: {
      format: "url",
      type: "string",
      minLength: 1,
    },
  },
};

const put = {
  type: "object",
  properties: {
    title: {
      type: "string",
      minLength: 1,
    },
    csvUrl: {
      format: "url",
      type: "string",
      minLength: 1,
    },
    tags: {
      type: "array",
      items: {
        type: "string",
        minLength: 1,
      },
    },
    youtubeUrl: {
      format: "url",
      type: "string",
      minLength: 1,
    },
  },
};

module.exports = {
  post,
  put,
};
