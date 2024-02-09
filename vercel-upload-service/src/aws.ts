import * as AWS from "aws-sdk"
import fs from "fs"
// fileName -> output/vud-c/README.md
// localFilePath ->/home/manoj-kumar/codex/vercel/dist/output/vud-c/README.md

// cb04e17596a35a5ba9922f2e97216087 accesskeyid
// ac8baa13ff087e84fc5b6684909175322a6170acc6ba520cd8666a405f48d5c8 secret
// https://8fb94a4a51e76902c72a26003761c2bf.r2.cloudflarestorage.com url

const s3 = new AWS.S3({
    accessKeyId: "cb04e17596a35a5ba9922f2e97216087",
    secretAccessKey: "ac8baa13ff087e84fc5b6684909175322a6170acc6ba520cd8666a405f48d5c8",
    endpoint: "https://8fb94a4a51e76902c72a26003761c2bf.r2.cloudflarestorage.com"
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