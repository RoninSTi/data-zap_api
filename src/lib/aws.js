const aws = require("aws-sdk");

aws.config.update({
  region: "us-east-2",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

console.log({ accessKeyId: process.env.AWS_ACCESS_KEY_ID });

const getSignedUploadUrl = async ({ fileName, fileType, userId }) => {
  const s3 = new aws.S3({ signatureVersion: "v4" });

  const s3Params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Expires: 10000,
    ContentType: fileType,
    ACL: "public-read",
    Metadata: {
      userId,
    },
  };

  return new Promise((resolve, reject) => {
    s3.getSignedUrl("putObject", s3Params, (err, data) => {
      if (err) {
        reject(err);
      }

      const returnData = {
        url: data,
        method: "put",
        headers: {
          "content-type": fileType,
          "x-amz-acl": "public-read",
        },
      };

      resolve(returnData);
    });
  });
};

module.exports = {
  getSignedUploadUrl,
};
