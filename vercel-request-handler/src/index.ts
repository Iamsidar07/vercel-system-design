import express from "express"
import cors from "cors"
import * as AWS from "aws-sdk"

const app = express()
app.use(cors())

const s3 = new AWS.S3({
    accessKeyId: "cb04e17596a35a5ba9922f2e97216087",
    secretAccessKey: "ac8baa13ff087e84fc5b6684909175322a6170acc6ba520cd8666a405f48d5c8",
    endpoint: "https://8fb94a4a51e76902c72a26003761c2bf.r2.cloudflarestorage.com"
})


app.get("/*", async (req, res) => {
    console.log(req.hostname)
    const host = req.hostname
    const id = host.split(".")[0] //subdomain
    const filePath = req.path;

    const contents = await s3.getObject({
        Bucket: "vercel",
        Key: `dist/${id}${filePath}`
    }).promise();

    const type = filePath.endsWith("html") ? "text/html" : filePath.endsWith("css") ? "text/css" : "application/javascript"
    res.set("Content-Type", type);
    res.send(contents.Body);
})

app.listen(3001, () => console.log("running on http://localhost:3001"))