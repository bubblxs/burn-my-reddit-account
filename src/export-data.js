import fs from "fs"
import os from "os"

import GetSubreddits from "./api/get-subreddits.js"
import GetSavedOrUpvoted from "./api/get-saved-or-upvoted.js"

export default async function ExportAccountData(redditSession, username) {
    const subreddits = await GetSubreddits(redditSession, false)
    const upvoted = await GetSavedOrUpvoted(username, redditSession, "upvoted")
    const saved = await GetSavedOrUpvoted(username, redditSession, "saved")
    const savePath = `${os.homedir()}\\`
    
    console.log(subreddits)
    console.log(upvoted)
    console.log(saved)

    let fileSchema = new FileSchema()
    let fileName = fileSchema.fileName()
    
    fileSchema.subreddits = subreddits
    fileSchema.upvoted = upvoted
    fileSchema.saved = saved
    
    let fileContent = JSON.stringify(fileSchema)

    fs.writeFileSync(savePath + `${fileName}.json`, fileContent, "utf-8", (succ, err) => {
        if (err) throw new Error(`Error! --> ${err}`)
    })

    console.log(`${fileName}.json saved at ${savePath}`)
}

class FileSchema {
    constructor(subreddits, upvoted, saved) {
        this.subreddits = subreddits
        this.upvoted = upvoted
        this.saved = saved
    } 

    fileName() {
        return Math.floor(new Date().getTime() / 1000)
    }
}