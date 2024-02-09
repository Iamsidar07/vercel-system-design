import * as AWS from "aws-sdk"
import fs from "fs"
import env from "dotenv"
env.config()

// fileName -> output/vud-c/README.md
// localFilePath ->/home/manoj-kumar/codex/vercel/dist/output/vud-c/README.md
console.log({ key: process.env.accessKeyId })
const s3 = new AWS.S3({
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey,
    endpoint: process.env.endpoint
})

export async function uploadFile(fileName: string, localFilePath: string) {
    const content = fs.readFileSync(localFilePath)
    const response = await s3.upload({
        Bucket: "vercel",
        Key: fileName,
        Body: content
    }).promise()
    console.log(response)
}