const post = {
  type: "object",
  required: ["fileName", "fileType"],
  properties: {
    fileName: {
      type: "string",
    },
    fileType: {
      type: "string",
    },
  },
};

module.exports = {
  post,
};
