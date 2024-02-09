import fs from "fs"
import path from "path"

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

