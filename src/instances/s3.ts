import AWS from "aws-sdk";

export const BUCKET_NAME = import.meta.env.VITE_BUCKET_NAME;

AWS.config.update({
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: import.meta.env.VITE_AWS_IDENTITY_POOL_ID || "",
  }),
});

AWS.config.apiVersions = {
  s3: "2006-03-01",
};

const s3 = new AWS.S3({
  params: {
    Bucket: BUCKET_NAME,
  },
  accessKeyId: import.meta.env.VITE_AWS_S3_ACCESS_KEY,
  secretAccessKey: import.meta.env.VITE_AWS_S3_SECRET_KEY,
  region: import.meta.env.VITE_AWS_S3_REGION,
});

export default s3;
