import { exec, spawn } from "child_process";
import path from "path";
export function buildProject(id: string) {
  return new Promise((resolve) => {
    const folderPath = path.join(__dirname, `output/${id}`);
    const child = exec(`cd ${folderPath} && npm install && npm run build`);
    child.stdout?.on("data", (data) => {
      console.log("stdout: ", data);
    });
    child.stderr?.on("data", (data) => {
      console.log("stderr: ", data);
    });
    child.on("close", (code) => {
      console.log("close: ", code);
      resolve("");
    });
  });
}
