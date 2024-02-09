import { commandOptions, createClient } from "redis"
import { copyFinalDist, downloadS3Folder } from "./aws"
import { buildProject } from "./buildProject"
const subscriber = createClient()
subscriber.connect()

const publisher = createClient()
publisher.connect()

async function main() {
  while (true) {
    const response = await subscriber.brPop(
      commandOptions({ isolated: true }),
      "build-queue",
      0
    )
    // @ts-ignore
    const id = response?.element
    if (!id) return
    await downloadS3Folder(`output/${id}`)
    await buildProject(id)
    await copyFinalDist(id)
    publisher.hSet("status", id, "deployed")
  }
}

main()
