import express from "express"
import cors from "cors"
import { generate } from "./utils"
import simpleGit from 'simple-git';
import path from "path"
import { getAllFilePaths } from "./file";
import { uploadFile } from "./aws";
import { createClient } from "redis"
const publisher = createClient()
publisher.connect()

const subscriber = createClient()
subscriber.connect()

const app = express()
app.use(cors())
app.use(express.json())


app.post("/deploy", async (req, res) => {
  const repoUrl = req.body.repoUrl
  const id = generate()
  await simpleGit().clone(repoUrl, path.join(__dirname, `output/${id}`))
  const files = getAllFilePaths(path.join(__dirname, `output/${id}`))
  files.forEach(async file => {
    const fileName = file.substring(__dirname.length + 1)
    await uploadFile(fileName, file)
  })
  publisher.lPush("build-queue", id)
  publisher.hSet("status", id, "uploaded")
  res.json({
    id
  })
})

app.get("/status", async (req, res) => {
  const id = req.query.id
  const status = await subscriber.hGet("status", id as string)
  res.json({
    status
  })
})

app.listen(3000, () => console.log("running on http://localhost:3000"))
