import * as AWS from "aws-sdk"
import path from "path"
import fs from "fs"

const s3 = new AWS.S3({
  accessKeyId: "cb04e17596a35a5ba9922f2e97216087",
  secretAccessKey: "ac8baa13ff087e84fc5b6684909175322a6170acc6ba520cd8666a405f48d5c8",
  endpoint: "https://8fb94a4a51e76902c72a26003761c2bf.r2.cloudflarestorage.com"
})

export async function downloadS3Folder(prefix: string) {
  const allFiles = await s3.listObjectsV2({
    Bucket: "vercel",
    Prefix: prefix
  }).promise()
  const allPromises = allFiles.Contents?.map(async ({ Key }) => {
    return new Promise((resolve) => {
      if (!Key) { return }
      const finalOutputPath = path.join(__dirname, Key)
      const outputFile = fs.createWriteStream(finalOutputPath)
      const dirName = path.dirname(finalOutputPath)
      if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName, { recursive: true })
      }
      s3.getObject({
        Bucket: "vercel",
        Key: Key || ""
      }).createReadStream()
        .pipe(outputFile)
        .on("finish", () => resolve(""))
    })
  }) || []
  await Promise.all(allPromises.filter(x => x !== undefined))
}

export async function uploadFile(fileName: string, localFilePath: string) {
  const content = fs.readFileSync(localFilePath)
  const response = await s3.upload({
    Bucket: "vercel",
    Key: fileName,
    Body: content
  }).promise()
}

export function getAllFilePaths(folderPath: string) {
  let response: string[] = []
  const allFilesAndFolders = fs.readdirSync(folderPath)
  allFilesAndFolders.forEach(file => {
    const fullFilePath = path.join(folderPath, file)

    const isDirectory = fs.statSync(fullFilePath).isDirectory()
    if (isDirectory) {
      response = response.concat(getAllFilePaths(fullFilePath))
    } else {
      response.push(fullFilePath)
    }
  });
  return response
}

export async function copyFinalDist(id: string) {
  const folderPath = path.join(__dirname, `output/${id}/dist`)
  const files = getAllFilePaths(folderPath)
  files.map((file) => {
    uploadFile(
      `dist/${id}/` + file.substring(folderPath.length + 1),
      file
    )
  })
}
