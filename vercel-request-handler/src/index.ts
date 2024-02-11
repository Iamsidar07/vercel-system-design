import express from "express";
import cors from "cors";
import * as AWS from "aws-sdk";
import env from "dotenv";

env.config();
const app = express();
app.use(cors());

const s3 = new AWS.S3({
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  endpoint: process.env.endpoint,
});

app.get("/*", async (req, res) => {
  console.log(req.hostname);
  const host = req.hostname;
  const id = host.split(".")[0]; //subdomain
  const filePath = req.path;

  const contents = await s3
    .getObject({
      Bucket: "vercel",
      Key: `dist/${id}${filePath}`,
    })
    .promise();

  const type = filePath.endsWith("html")
    ? "text/html"
    : filePath.endsWith("css")
    ? "text/css"
    : "application/javascript";
  res.set("Content-Type", type);
  res.send(contents.Body);
});

app.listen(3001, () => console.log("running on http://localhost:3001"));
