import fs from "fs"
import path from "path"

export function getAllFilePaths(folderPath: string) {
    // let response: string[] = []
    // const allFilesAndFolders = fs.readdirSync(folderPath)
    // allFilesAndFolders.forEach(file => {
    //     const fullFilePath = path.join(folderPath, file)

    //     const isDirectory = fs.statSync(fullFilePath).isDirectory()
    //     if (isDirectory) {
    //         response = response.concat(getAllFilePaths(fullFilePath))
    //     } else {
    //         response.push(fullFilePath)
    //     }
    // });
    // return response

    const allFilesAndFolders = fs.readdirSync(folderPath, { recursive: true })
    const response = []
    for (const fileOrFolder of allFilesAndFolders) {
        const fileOrFolderPath = path.join(folderPath, fileOrFolder as string)
        const isDirectory = fs.statSync(fileOrFolderPath).isDirectory()
        if (!isDirectory) {
            response.push(fileOrFolderPath)
        }
    }
    return response
}
