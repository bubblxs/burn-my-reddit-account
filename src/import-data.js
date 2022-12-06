import fs from "fs"
import prompts from "prompts"

import Save from "./api/save.js"
import Login from "./api/login.js"
import Upvote from "./api/upvote.js"
import JoinSubreddit from "./api/join-subreddit.js"

import { GetCredentials } from "./credentials.js"
 
export default async function ImportAccountData() {
    //TO DO: VALIDATE PATH, FILE EXTENTION AND CONTENT
    const { filePath } = await prompts({
        type: "text",
        name: "filePath",
        message: "File path",
    })

    const { subreddits, upvoted, saved } = JSON.parse(fs.readFileSync(filePath, { encoding: "utf-8" }))
    const { username, password } = await GetCredentials()
    const { redditSession, modhash } = await Login(username, password)
    
    if (subreddits) {
        for (let sr of subreddits) {
            JoinSubreddit(sr, modhash, redditSession)
                .catch(err => console.log(`Error joining ${sr}. Code: ${err.response.status}`))
        }
    }

    if (upvoted) {
        for (let up of upvoted) {
            Upvote(up.postId, up.subreddit, modhash, redditSession)
                .catch((err) => {
                    if (err.response.status === 400) {
                        console.log(`Post ${up.postId} from ${up.subreddit} couldn't be upvoted, so it was saved instead.`)
                    }

                    Save(up.postId, redditSession, modhash)
                        .catch(err => console.log(`Post ${up.postId} couldn't be saved either lol. Error ${err.message}`))
                })
        }
    }

    if (saved) {
        for (let save of saved) {
            Save(save.postId, redditSession, modhash)
                .catch(err => console.log(`Error "${err.message}" while saving ${save.postId} from ${save.subreddit}`))
        }
    }
}